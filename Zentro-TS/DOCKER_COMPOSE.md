# Zentro — PART 18 (Docker Compose)

## Objective

Run the complete development environment using Docker Compose.

---

# Services

Create compose configuration for

- frontend
- backend
- mongodb
- redis
- nginx

---

# Volumes

Persistent volumes for

MongoDB

Redis

Uploads (if needed)

---

# Networks

Internal network

Public network

---

# Environment

Use .env files.

Support

Development

Production

---

# Startup Order

MongoDB

↓

Redis

↓

Backend

↓

Frontend

↓

Nginx

---

# Commands

Support

docker compose up

docker compose down

docker compose logs

docker compose restart

---

# Verification

✓ One command starts everything

✓ Live reload works

✓ Networking works

✓ Environment variables work