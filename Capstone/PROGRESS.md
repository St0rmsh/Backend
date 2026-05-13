# Capstone Project — Progress Tracker

> **Last updated:** 2026-05-13

---

## Project Overview

A cloud-based **sandbox / codespace platform** built with a microservices architecture. Users can spin up isolated coding environments (Vite React apps) on demand, each running inside its own Kubernetes pod with a unique preview URL.

**Tech Stack:** Node.js, Express, Kubernetes (Docker Desktop), Nginx Ingress, Docker

---

## Architecture

```
User Request
     │
     ▼
┌──────────────────────┐
│   Nginx Ingress      │
│   Controller         │
└──────┬───────┬───────┘
       │       │
  /api/sandbox  *.preview.localhost
       │       │
       ▼       ▼
┌──────────┐ ┌──────────────┐
│ Sandbox  │ │   Router     │
│ API      │ │   Service    │
│ Server   │ │  (proxy)     │
└──────────┘ └──────┬───────┘
       │            │
       │   ┌────────┼────────┐
       │   ▼        ▼        ▼
       │ ┌─────┐ ┌─────┐ ┌─────┐
       │ │Pod A│ │Pod B│ │Pod C│
       │ │:5173│ │:5173│ │:5173│
       │ └─────┘ └─────┘ └─────┘
       │  (Vite)  (Vite)  (Vite)
       │
       ▼
   K8s API
  (create pods/services)
```

---

## What Has Been Implemented

### 1. Sandbox Template (Docker Image)

**Location:** `sandbox/template/`

- A **Vite + React** starter app containerized with Docker.
- Runs `npm run dev -- --host 0.0.0.0` inside the container, exposing port **5173**.
- Built as `template:latest` Docker image (local, never pulled from registry).
- Dockerfile uses `node:20-alpine` base, workdir `/workspace`.

### 2. Sandbox API Server (Microservice)

**Location:** `sandbox/server/`

The control plane service responsible for creating and managing sandbox environments.

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/sandbox/health` | Health check — returns status, message, timestamp |
| `POST` | `/api/sandbox/start` | Creates a new sandbox pod + service, waits for readiness, returns preview URL |

**Key Implementation Details:**

- **Kubernetes Client:** Uses `@kubernetes/client-node` SDK to programmatically create pods and services (`sandbox/server/src/kubernetes/config.js`).
- **Pod Creation** (`sandbox/server/src/kubernetes/pod.js`):
  - Creates a pod named `sandbox-pod-<uuid>` with label `app: sandbox-instance`.
  - Runs `template:latest` image with `imagePullPolicy: Never` (local image).
  - Container exposes port 5173.
  - Includes a **readiness probe** (`httpGet` on `/` at port 5173) so K8s knows when Vite is ready.
  - Resource limits: 500m CPU, 1Gi memory.
- **Service Creation** (`sandbox/server/src/kubernetes/service.js`):
  - Creates a ClusterIP service named `sandbox-service-<uuid>`.
  - Selector: `app: sandbox-instance, id: <uuid>` — targets only its specific pod.
  - Maps port 80 → targetPort 5173.
- **Pod Readiness Polling** (`sandbox/server/src/app.js`):
  - `waitForPodReady()` polls the K8s API every 2 seconds (up to 60s timeout).
  - Checks `pod.status.phase === "Running"` and all `containerStatuses[].ready === true`.
  - The `/api/sandbox/start` endpoint **only returns the preview URL after the pod is confirmed ready** — prevents proxy errors on first access.
- **UUID Generation:** Uses `uuid` v7 (time-ordered) for sandbox IDs.

### 3. Router / Reverse Proxy Service

**Location:** `sandbox/router/`

A lightweight Express server that proxies wildcard subdomain requests to the correct sandbox pod.

**How it works:**
1. Nginx Ingress routes `*.preview.localhost` requests → Router Service.
2. Router extracts the sandbox ID from the `Host` header (e.g., `<uuid>.preview.localhost` → `<uuid>`).
3. Proxies the request to `http://sandbox-service-<uuid>.default.svc.cluster.local` using `http-proxy-middleware`.
4. Supports WebSocket proxying (`ws: true`).

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/status/healthz` | Liveness probe |
| `GET` | `/api/status/readyz` | Readiness probe |
| `*` | `/*` | Proxy middleware — routes to sandbox service based on Host header |

### 4. Kubernetes Infrastructure

**Location:** `k8s/`

All K8s manifests for deploying the platform on Docker Desktop Kubernetes.

| File | Resource | Description |
|------|----------|-------------|
| `sandbox-deployment.yml` | Deployment | Runs sandbox API server (`sandbox:latest`), 1 replica, `app: sandbox` label, uses `resource-manager` ServiceAccount |
| `sandbox-service.yml` | ClusterIP Service | Exposes sandbox API server on port 80 → 3000, selector `app: sandbox` |
| `router-deployment.yml` | Deployment | Runs router proxy (`router:latest`), 1 replica, `app: router` label, liveness/readiness probes |
| `router-service.yml` | ClusterIP Service | Exposes router on port 80 → 3000, selector `app: router` |
| `ingress.yml` | Ingress | Nginx ingress with two rules: `/api/sandbox` → sandbox-service, `*.preview.localhost` → router-service |
| `rbac.yml` | ServiceAccount + Role + RoleBinding | `resource-manager` SA with permissions to `get/list/watch/create/delete` pods and services in default namespace |

### 5. Bug Fixes & Debugging Log

> Every bug we encounter is documented here with full context so we can learn from it and never repeat the same mistake.

---

#### 🐛 BUG #1: 502 Bad Gateway from Nginx on all API requests

**Date:** 2026-05-13

**Error seen:**
```
<h1>502 Bad Gateway</h1>
<center>nginx</center>
```
Happened when hitting `http://localhost/api/sandbox/start` or `http://localhost/api/sandbox/health`.

**How we diagnosed it:**

1. **Checked pod status** — `kubectl get pods -A` showed all pods were `Running`, so nothing was crashing.

2. **Checked Nginx Ingress logs** — `kubectl logs ingress-nginx-controller-xxx -n ingress-nginx`:
   ```
   connect() failed (111: Connection refused) while connecting to upstream,
   upstream: "http://10.1.1.133:3000/api/sandbox/start"
   ```
   Nginx was trying to connect to IP `10.1.1.133` on port 3000 — but that IP belonged to a **sandbox pod** (Vite on port 5173), NOT the sandbox API server (Express on port 3000).

3. **Checked endpoints** — `kubectl get endpoints` revealed the `sandbox-service` had endpoints pointing to BOTH the API pod AND the user sandbox pods:
   ```
   sandbox-service   10.1.1.133:3000,10.1.1.135:3000,10.1.1.139:3000
   ```
   Only `10.1.1.139` was the actual API server. The others were Vite sandbox pods that don't listen on port 3000.

4. **Checked labels** — `kubectl get pods --show-labels`:
   ```
   sandbox-deployment-xxx   app=sandbox,pod-template-hash=6cd444c69b
   sandbox-pod-019e1fda...  app=sandbox,id=019e1fda...
   sandbox-pod-019e1fe0...  app=sandbox,id=019e1fe0...
   ```
   All pods had `app=sandbox`. The `sandbox-service` selector was `app: sandbox` — so it matched ALL of them.

**Root Cause:**

The pod manifest in `sandbox/server/src/kubernetes/pod.js` was creating user sandbox pods with the label `app: "sandbox"`. This is the **same label** used by the sandbox API server deployment (`k8s/sandbox-deployment.yml`). The K8s Service `sandbox-service` uses selector `app: sandbox`, so it picked up ALL pods — both the API server and every user sandbox pod. Nginx would round-robin between them. When it hit a Vite pod on port 3000 (which only listens on 5173) → **Connection refused → 502**.

**What we changed:**

`sandbox/server/src/kubernetes/pod.js`:
```diff
 labels: {
-    app: "sandbox",
+    app: "sandbox-instance",
     id: sandboxId
 }
```

`sandbox/server/src/kubernetes/service.js`:
```diff
 selector: {
     id: sandboxId,
-    app: "sandbox"
+    app: "sandbox-instance"
 }
```

**Result:** The `sandbox-service` now only targets the API server pod. User sandbox pods have their own unique per-sandbox services. No more 502s on API calls.

---

#### 🐛 BUG #2: "Error occurred while trying to proxy" on preview URL

**Date:** 2026-05-13

**Error seen:**
```
Error occurred while trying to proxy: 019e205a-5fe3-7339-afdf-905f6462777b.preview.localhost/
```
Happened when opening the preview URL immediately after `/api/sandbox/start` returned it.

**How we diagnosed it:**

1. **Checked the per-sandbox service endpoints** — `kubectl get endpoints`:
   ```
   sandbox-service-019e205a-5fe3-7339-afdf-905f6462777b   <none>
   ```
   The service existed but had **zero endpoints** — meaning no pod was matching its selector, or the pod's readiness probe hadn't passed yet.

2. **Checked pods** — `kubectl get pods -l id=019e205a-5fe3-7339-afdf-905f6462777b`:
   ```
   No resources found in default namespace.
   ```
   The pod for this sandbox didn't even exist anymore (it was cleaned up during a previous redeployment). But even for new sandboxes, the issue would happen because:

3. **Traced the API flow** in `sandbox/server/src/app.js`:
   ```javascript
   await createPod(sandboxId);
   await createService(sandboxId);
   // IMMEDIATELY returns — doesn't wait for pod readiness!
   return res.status(201).json({ previewUrl: `http://${sandboxId}.preview.localhost` });
   ```
   The API creates the pod, creates the service, and returns instantly. But the Vite dev server inside the pod takes **10-20 seconds to start**. Until the pod's readiness probe passes, the service has 0 endpoints. The router tries to proxy to a service with no backends → proxy error.

**Root Cause:**

The `/api/sandbox/start` endpoint was returning the preview URL **before the pod was ready to serve traffic**. There was no readiness wait between creating the K8s resources and returning the URL to the user.

**What we changed:**

Added a `waitForPodReady()` function in `sandbox/server/src/app.js`:
```javascript
async function waitForPodReady(sandboxId, timeoutMs = 60000) {
    const podName = `sandbox-pod-${sandboxId}`;
    const start = Date.now();
    
    while (Date.now() - start < timeoutMs) {
        try {
            const pod = await k8sCoreV1Api.readNamespacedPod({
                name: podName,
                namespace: "default"
            });
            
            const containerStatuses = pod.status?.containerStatuses || [];
            const allReady = containerStatuses.length > 0 && 
                             containerStatuses.every(c => c.ready === true);
            
            if (allReady && pod.status?.phase === "Running") {
                console.log(`Pod ${podName} is ready`);
                return true;
            }
        } catch (err) {
            // Pod might not exist yet, keep polling
        }
        
        // Wait 2 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error(`Pod ${podName} did not become ready within ${timeoutMs}ms`);
}
```

And called it before returning the URL:
```diff
  await createPod(sandboxId);
  await createService(sandboxId);
+
+ // Wait for the pod to be ready before returning the preview URL
+ await waitForPodReady(sandboxId);
+
  return res.status(201).json({
    message: "Sandbox started successfully",
    sandboxId,
    previewUrl: `http://${sandboxId}.preview.localhost`
  })
```

**Result:** The POST `/api/sandbox/start` now takes ~10-20 seconds (while the pod boots), but when it returns the preview URL, the sandbox is guaranteed to be live. No more proxy errors.

---

#### 🧹 CLEANUP: Orphaned Services

**Date:** 2026-05-13

During debugging, several sandbox services were left behind with no backing pods (pods were deleted during redeployments but services weren't):
```
sandbox-service-019e204b-bc48-75b9-b31d-6632d5dffb29   <none>
sandbox-service-019e2053-16ed-7231-a547-f644b9ee1617   <none>
sandbox-service-019e205a-5fe3-7339-afdf-905f6462777b   <none>
```

Cleaned up manually:
```bash
kubectl delete svc sandbox-service-019e204b-... sandbox-service-019e2053-... sandbox-service-019e205a-...
```

**Note for future:** We need to implement a sandbox cleanup/TTL system that auto-deletes both pods AND their services after a timeout.

---

## Planned / Not Yet Implemented

- [ ] **Auth Service** (`Auth/`)
- [ ] **AI Orchestration / Multi-Agent System** (`ai-orchestration/`)
- [ ] **Notification Service** (`notification/`)
- [ ] **Sandbox Cleanup / TTL** — auto-delete idle pods after timeout
- [ ] **File System Sync** — live code editing in sandbox containers
- [ ] **Terminal WebSocket** — exec into sandbox containers from browser
- [ ] **Frontend UI** — web-based IDE / dashboard

---

## How to Run

```bash
# 1. Build Docker images
docker build -t template:latest ./sandbox/template
docker build -t sandbox:latest ./sandbox/server
docker build -t router:latest  ./sandbox/router

# 2. Apply K8s manifests
kubectl apply -f k8s/rbac.yml
kubectl apply -f k8s/sandbox-deployment.yml
kubectl apply -f k8s/sandbox-service.yml
kubectl apply -f k8s/router-deployment.yml
kubectl apply -f k8s/router-service.yml
kubectl apply -f k8s/ingress.yml

# 3. Create a sandbox
curl -X POST http://localhost/api/sandbox/start

# 4. Open the preview URL returned in the response
# Example: http://019e206c-6c1b-72ab-bc06-e8d1cca9c2aa.preview.localhost
```
