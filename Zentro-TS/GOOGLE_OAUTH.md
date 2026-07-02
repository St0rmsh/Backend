# Zentro Frontend — Google OAuth Authentication

## Objective

Implement a production-ready Google Authentication flow using Passport Google OAuth.

Read before implementation:

- 00_MASTER_GUIDE.md
- 01_PART_0_FOUNDATION.md
- 02_PART_1_AUTH.md
- 02_AUTH_HYDRATION_AND_SILENT_AUTH.md

Google OAuth must integrate seamlessly with the existing authentication system.

Do NOT create a separate authentication architecture.

Google Login should reuse the same Redux, Axios, Hydration, Cookie, and Socket systems already implemented.

---

# Backend

Authentication Provider

Passport Google OAuth 2.0

Backend Endpoint

GET

/api/auth/google

Callback

GET

/api/auth/google/callback

Backend will

• authenticate user
• create account if first login
• issue Access Token
• issue Refresh Token
• store tokens in Cookies
• redirect frontend

---

# Frontend Flow

User clicks

Continue with Google

↓

Redirect

/api/auth/google

↓

Google Authentication

↓

Backend Callback

↓

Access Token Cookie

↓

Refresh Token Cookie

↓

Redirect Frontend

↓

Hydrate Authentication

↓

GET /auth/me

↓

Redux updated

↓

Socket Connected

↓

Redirect Home

User never manually logs in.

---

# Cookie Handling

Google Login must store

Access Token

Refresh Token

inside Cookies.

Never LocalStorage.

Support future HttpOnly Cookies.

---

# Authentication Hydration

After successful Google OAuth

Immediately execute

GET

/auth/me

Backend becomes source of truth.

Update Redux

currentUser

isAuthenticated

hydrationCompleted

Never decode JWT inside frontend.

---

# Existing Authentication

Google Login must reuse

Auth Slice

User Slice

Axios Instance

Interceptors

Hydration

Protected Routes

Guest Routes

Socket Lifecycle

No duplicated authentication logic.

---

# Automatic Access Token Refresh

Google users must also support

Automatic Refresh Token Flow.

Exactly identical to Email Login.

Access Token expires

↓

401

↓

Refresh Token

↓

Retry Request

↓

Continue

No popup

No redirect

No logout

Only logout when Refresh Token becomes invalid.

---

# Socket Integration

After Google Login

Connect Socket automatically.

socket.auth.token = accessToken

socket.connect()

If Access Token rotates

Reconnect Socket automatically.

No duplicated listeners.

---

# UI

Login Page

Register Page

must contain

Continue with Google

Button

Design

Minimal

Professional

Google Brand Guidelines

Light Border

Google Icon

No rainbow effects.

---

# First Login

If user does not exist

Backend creates account.

Frontend should not care.

After redirect

Hydrate

GET /auth/me

Continue normally.

---

# Existing User

If Google email already exists

Backend links account

or logs user in.

Frontend uses same flow.

No extra logic.

---

# Error Handling

Handle

Popup Closed

Cancelled Login

OAuth Failure

Backend Failure

Network Failure

Display friendly error.

Never expose backend messages.

---

# Protected Routes

Google users

Email users

must behave identically.

No special conditions.

---

# Redux

No separate Google Slice.

Reuse

Auth Slice

User Slice

Loading Slice

Notification Slice

Socket Slice

---

# Components

Create reusable

Google Login Button

OAuth Divider

Social Login Section

OAuth Loader

Authentication Card

No duplicated buttons.

---

# Accessibility

Keyboard Support

ARIA Labels

Focus States

Screen Reader Support

---

# Future Providers

Architecture must easily support

GitHub OAuth

Discord OAuth

Apple OAuth

Microsoft OAuth

Facebook OAuth

without refactoring.

Create reusable OAuth architecture.

Example

OAuthProvider

OAuthButton

OAuthService

OAuthConfig

OAuthTypes

Provider Registry

Adding a new provider should require only configuration.

---

# Verification Checklist

Verify at least four times

✓ Google Login works

✓ Existing Login still works

✓ Redux hydrates correctly

✓ /auth/me restores user

✓ Protected Routes work

✓ Guest Routes work

✓ Cookies update correctly

✓ Refresh Token works automatically

✓ Socket connects automatically

✓ Socket reconnects after token refresh

✓ No duplicated authentication logic

✓ No duplicated Redux state

✓ No duplicated API calls

✓ No React warnings

✓ No TypeScript errors

✓ No memory leaks

✓ Production-ready architecture

Google OAuth must behave exactly like Instagram, Notion, GitHub, and LinkedIn authentication.