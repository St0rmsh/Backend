# Zentro Backend & Frontend — PART 17 (Docker Setup)

## Objective

Containerize the complete Zentro application.

This phase creates production-ready Docker images for every service.

No Kubernetes yet.

No AWS deployment yet.

No CI/CD yet.

---

# Components

Containerize

- Backend (Node.js + Express + TypeScript)
- Frontend (React + Vite)
- MongoDB (development only)
- Redis
- Nginx (production-ready)
- ImageKit remains external

---

# Backend Dockerfile

Requirements

- Multi-stage build
- Alpine image
- Production dependencies only
- Non-root user
- Healthcheck
- Environment variables
- Optimized image size
- Proper caching

---

# Frontend Dockerfile

Requirements

- Multi-stage build
- Build using Node
- Serve using Nginx
- Gzip enabled
- Cache headers
- SPA routing support
- Security headers

---

# .dockerignore

Create optimized dockerignore files.

---

# Environment Variables

Support

- Development
- Production
- Staging

---

# Healthcheck

Backend

GET

/health

Frontend

/

Redis

PING

---

# Security

Run containers as non-root.

Read-only filesystem where possible.

Drop unnecessary Linux capabilities.

---

# Networking

Create dedicated Docker network.

No container should expose unnecessary ports.

---

# Verification

✓ Images build successfully

✓ Small image size

✓ Multi-stage build

✓ Healthchecks pass

✓ No secrets inside images

✓ Production-ready