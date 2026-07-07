# Zentro — PART 19 (Kubernetes)

## Objective

Deploy Zentro on Kubernetes using production-ready manifests.

---

# Resources

Create

Namespace

Deployment

Service

ConfigMap

Secret

Ingress

Horizontal Pod Autoscaler

NetworkPolicy

PersistentVolume

PersistentVolumeClaim

---

# Backend

Deployment

Service

HPA

Readiness Probe

Liveness Probe

---

# Frontend

Deployment

Service

Ingress

---

# Redis

Deployment

Service

Persistent Volume

---

# MongoDB

StatefulSet

Persistent Volume

Headless Service

---

# Scaling

Backend

2–10 replicas

Frontend

2–10 replicas

---

# Healthchecks

/readiness

/liveness

---

# Verification

✓ kubectl apply works

✓ Rolling updates work

✓ Autoscaling works

✓ Pods recover automatically