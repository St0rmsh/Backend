# Zentro Frontend — PART 1 (Authentication Infrastructure)

## Objective

Read:

- 00_MASTER_GUIDE.md
- 01_PART_0_FOUNDATION.md

Do NOT build authentication pages yet.

This phase builds the complete authentication architecture that every future authentication screen will use.

---

# Goal

Build a production-ready authentication infrastructure.

No UI except minimal placeholders if absolutely necessary.

---

# Backend APIs

Implement service functions for:

POST /auth/register

POST /auth/login

GET /auth/me

POST /auth/logout

POST /auth/refresh-access-token

PATCH /auth/update-profile

POST /auth/send-otp

POST /auth/verify-otp

POST /auth/change-password

POST /auth/forgot-password

POST /auth/reset-password

---

# Axios

Complete axios configuration.

Implement

• Request Interceptor

• Response Interceptor

• Automatic Refresh Token

• Retry Failed Requests

• Unauthorized Handler

Prevent infinite retry loops.

---

# Cookie Management

Store

Access Token

Refresh Token

inside cookies.

Never use LocalStorage.

Implementation should remain compatible with future HttpOnly cookies.

---

# Redux

Complete:

Auth Slice

User Slice

Loading Slice

Notification Slice

Socket Slice

Theme Slice

Implement Redux Thunks.

No Context API.

---

# Services

Create

auth.service.ts

user.service.ts

upload.service.ts

No UI logic.

---

# Socket Lifecycle

After login:

Authenticate socket

Connect socket

After logout:

Disconnect socket

Reset socket state

Do not implement events.

Only lifecycle.

---

# Protected Routes

Implement

Protected Route

Guest Route

Role-ready Route Guard

Future-ready for:

Admin

Moderator

User

---

# Authentication State

Support

Initializing

Authenticated

Unauthenticated

Loading

Refreshing Token

Expired Session

Verification Pending

Password Reset Pending

---

# Upload Infrastructure

Prepare upload architecture for

Avatar

Banner

Multipart Upload

ImageKit

Multer

Progress tracking

Preview generation

Validation

Compression

Do not build upload UI yet.

---

# Validation

Create reusable Zod schemas.

Register

Login

Forgot Password

Reset Password

Change Password

OTP

Profile Update

---

# Types

Create

Auth Types

User Types

Token Types

Session Types

API Response Types

---

# Error Handling

Prepare handling for

401

403

404

500

Offline

Timeout

Validation

Refresh Failure

---

# Final Verification

Verify

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Refresh Token flow works

✓ Logout works

✓ Redux state is correct

✓ Socket lifecycle works

✓ Cookies work

Do NOT create authentication pages.

Stop here.