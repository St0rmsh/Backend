# Capstone Project — Progress Tracker

> **Last updated:** 2026-05-17

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

### 4. AI Orchestration Service (The "Brain")

**Location:** `ai-orchestration/`

This is the smart part of the project. It uses advanced AI models (like Gemini and Mistral) to understand user requests and write code automatically.

- **Dynamic Thread Context & LangGraph Integration:** Fully integrated LangGraph's prebuilt ReactAgent with a dynamic context engine. Configured agent thread properties (`configurable.sandboxId`) to pass execution-specific environment coordinates downstream to custom actions.
- **Calibrated Message State Routing:** Configured the Express controller (`agent.routes.js`) to validate incoming user prompts and properly align input payloads under the strict `messages` state schema expected by LangGraph, preventing graph initialization failures.
- **Unification under Mistral Model:** Established the Mistral AI large language model (`mistral-small-latest`) as the primary orchestration intelligence, with modular configurations prepared for Claude/Gemini model hot-swapping once appropriate Kubernetes secrets are populated.

### 5. Sandbox Agent (The "Hands")

**Location:** `sandbox/agent/`

Every sandbox now has its own "agent" that follows instructions from the AI Brain.

- **Dynamic Port-level Proxying & Discovery:** Upgraded file system tools (`tools.js`) to dynamically target the active sandbox instances using resolved pod naming structures (`http://sandbox-service-${sandboxId}:3000`) instead of relying on fragile static configurations.
- **RESTful Sandboxed Operations:** Built direct, performant workspace tools targeting `list-files`, `read-file`, `create-file`, and `update-file` to enable precise, isolated file manipulations inside the target sandbox container.
- **Isolated Node Workspace Interaction:** Enforced single-sandbox containment policies ensuring that tools invoked by the AI brain cannot access or modify resources belonging to unrelated sandboxes.

### 6. Kubernetes Infrastructure

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

### 7. Bug Fixes & Debugging Log

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

#### 🐛 BUG #3: 504 Gateway Time-out (Node Out of Memory)

**Date:** 2026-05-14

**Error seen:**
Nginx returned a `504 Gateway Time-out` when calling `/api/sandbox/start`.

**How we diagnosed it:**
1. Checked all pods using `kubectl get pods -A`. We noticed that several `sandbox-pod-<uuid>` instances were stuck in the `Pending` state.
2. Ran `kubectl describe pod <pending-pod-name>`, which revealed the following Event:
   `FailedScheduling: 0/1 nodes are available: 1 Insufficient memory`
3. Checked node resources: The Docker Desktop node only had ~3.5GB of allocatable memory. Each sandbox pod requested `500Mi` memory per container (totaling 1GB per pod). With several old, unused pods still running, the node hit 94% memory allocation, preventing any new pods from being scheduled. The API server's `waitForPodReady` function timed out after 60 seconds waiting for the pod to start, resulting in the 504.

**Root Cause:**
Node memory exhaustion due to high resource requests (1GB per pod) combined with no garbage collection/cleanup of old sandbox pods.

**What we changed:**
Lowered the resource limits in `sandbox/server/src/kubernetes/pod.js`:
```javascript
resources: {
    requests: { cpu: "100m", memory: "128Mi" },
    limits: { cpu: "250m", memory: "256Mi" }
}
```
We also manually deleted old, orphaned sandbox pods to free up node memory.

---

#### 🐛 BUG #4: `TypeError: createProxy(...) is not a function`

**Date:** 2026-05-14

**Error seen:**
The router crashed with `TypeError: createProxy(...) is not a function` when attempting to access any preview or agent subdomain.

**How we diagnosed it:**
Inspected `sandbox/router/src/app.js`. The routing middleware called `createProxy(sandboxId)(req, res, next)`. However, `createProxy` and `getAgentProxy` were defined as `async function`s.

**Root Cause:**
Async functions return Promises in JavaScript. Calling `(req, res, next)` directly on a Promise rather than on the resolved proxy middleware function caused the `TypeError`.

**What we changed:**
Made the Express middleware async and added `await` before invoking the proxy function:
```javascript
app.use(async (req, res, next) => {
   // ...
   if (host.split(".")[1] === "agent") {
      const proxy = await getAgentProxy(sandboxId);
      return proxy(req, res, next);
   }
   // ...
});
```

---

#### 🐛 BUG #5: Agent API returning Vite React App (HTML) instead of JSON

**Date:** 2026-05-14

**Error seen:**
Accessing `http://<uuid>.preview.localhost/list-files` returned the Vite React app `index.html` template instead of the expected JSON array of files.

**Root Cause:**
The request was made to the `.preview.localhost` subdomain instead of `.agent.localhost`. The `router` forwarded the `.preview` request to port 5173 (Vite). Since Vite is an SPA dev server, it falls back to serving `index.html` for unknown paths. The `/list-files` endpoint was actually hosted by the `agent-container` on port 3000. 

**What we changed:**
Instructed usage of the correct subdomain: `http://<uuid>.agent.localhost/list-files`.

---

#### 🐛 BUG #6: `sandbox-service` missing port 3000 & `agent-container` not spawning

**Date:** 2026-05-14

**Error seen:**
`Error occurred while trying to proxy: <uuid>.agent.localhost/list-files`. Additionally, running `kubectl logs <pod> -c agent-container` returned `error: container agent-container is not valid for pod`.

**How we diagnosed it:**
1. Described the newly created service (`kubectl get svc <service-name> -o yaml`). It only exposed port 80 (target 5173), meaning port 3000 was completely missing.
2. Described the pod (`kubectl get pod <pod-name> -o yaml`). It only had `sandbox-container`. The `agent-container` was entirely missing from the pod specification.
3. Attempted to manually trigger `/api/sandbox/start` and checked the server logs, which threw a `422 Unprocessable Entity` from the K8s API.
4. The error message explicitly stated: `Invalid value: "init-Container": a lowercase RFC 1123 label must consist of lower case alphanumeric characters or '-'`.

**Root Cause:**
1. **Capital Letter in Container Name:** The `pod.js` manifest contained an init container named `init-Container` (with a capital `C`). Kubernetes enforces strict lowercase validation for container names. This caused pod creation to fail silently.
2. **Stale Docker Image:** The `sandbox-deployment` was still running an older version of the `sandbox:latest` image because subsequent builds had been tagged incorrectly (`sandbox-server:latest`). Thus, the older server code was creating pods and services without the `agent` configurations.

**What we changed:**
1. Fixed the casing in `sandbox/server/src/kubernetes/pod.js`: `name: "init-container"`.
2. Rebuilt the API server with the correct tag: `docker build -t sandbox:latest ./sandbox/server`.
3. Restarted the deployment: `kubectl rollout restart deployment sandbox-deployment`.

**Result:** Calling `/api/sandbox/start` now successfully generates a pod with both `sandbox-container` (Vite) and `agent-container` (API), and properly wires up both ports on the service.

---

#### 🐛 BUG #7: `GraphRecursionError` & `504 Gateway Time-out` in AI Orchestration (`/api/ai/invoke`)

**Date:** 2026-05-17

**Error seen:**
1. In `ai-orchestration` server logs or client payload:
   ```json
   {
       "message": "Internal server error",
       "error": {
           "lc_error_code": "GRAPH_RECURSION_LIMIT",
           "name": "GraphRecursionError"
       }
   }
   ```
2. When calling `/api/ai/invoke` through Nginx Ingress:
   ```html
   <html>
   <head><title>504 Gateway Time-out</title></head>
   <body><center><h1>504 Gateway Time-out</h1></center><hr><center>nginx</center></body>
   </html>
   ```

**How we diagnosed it:**
1. **Dynamic Sandbox Endpoint Failure**: The sandbox agent tools in `tools.js` used a hardcoded, stale URL from a dead pod session (`sandbox-service-19e34d4...`). Since the tools failed to connect, the prebuilt LangGraph `ReactAgent` entered an infinite loop of retrying tool calls, eventually crashing with `GraphRecursionError` when hitting the recursion limit.
2. **CrashLoopBackOff & Stuck Rollout**: When attempting to resolve this, the newer pods failed to boot and crashed with:
   `Error: Please set an API key for Google GenerativeAI... in ChatGoogleGenerativeAI constructor`
   This happened because the previous built Docker image of `ai-orchestration` left the Gemini model instantiation uncommented in `code.agent.js`. Because `GOOGLE_API_KEY` was missing from the deployment's environment variables, Node crashed immediately on boot, putting the deployment in `CrashLoopBackOff`.
3. **Nginx 504 Gateway Time-out**: Since the new container was stuck in a crash loop, Kubernetes routed incoming traffic to the OLD active pods. These old pods still had the hardcoded sandbox service URL and the wrong `message` state initialization key. Making a request through Ingress resulted in a hang and eventual Nginx 504 timeout.

**What we changed:**
1. **Dynamic Tool URL Construction**: Refactored `tools.js` to accept `config` parameters and dynamically construct the target agent URLs using `config?.configurable?.sandboxId` instead of a hardcoded string.
2. **Controller/Router Payload & Context Mapping**: Corrected the route parameter key in `agent.routes.js` to use `messages` (required by LangGraph ReactAgent schema) and parsed/passed the `sandboxId` as thread configuration `configurable`.
3. **Image Rebuild & Rollout Restart**: Commented out the unused Gemini and Claude instantiations in `code.agent.js` to prevent API key startup crashes. Rebuilt the local Docker image using `docker build -t ai-orchestration ./ai-orchestration` and triggered `kubectl rollout restart deployment ai-deployment`.

**Result:**
The AI-orchestration service boots successfully and healthy (`1/1 READY`), correctly maps requests, dynamically communicates with the designated sandbox agent pod, and returns the expected code generations without timeouts.

---

## Planned / Not Yet Implemented

- [ ] **Auth Service** — So users can log in and save their work.
- [ ] **Notification Service** — To tell users when things happen.
- [ ] **Sandbox Cleanup** — Automatically delete old sandboxes to save space.
- [ ] **Live Collaboration** — Multiple people working on the same code.
- [ ] **Web Dashboard** — A pretty website to manage everything.

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
