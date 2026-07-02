# Zentro Frontend — Authentication Hydration & Silent Authentication

## Objective

Implement a production-ready authentication lifecycle identical to Instagram, GitHub, LinkedIn, and Notion.

The application must automatically restore the logged-in user after refresh, browser restart, or Access Token expiration.

Redux must NEVER be considered persistent storage.

Redux should always be hydrated from the backend.

---

# Authentication Philosophy

Cookies store tokens.

Redux stores authenticated user state.

Backend is the source of truth.

Frontend must always restore authentication by calling:

GET

/auth/me

instead of trying to restore Redux manually.

---

# Application Startup Flow

When the application starts:

App

↓

Redux Store

↓

Check authentication

↓

Call

GET /auth/me

↓

If authenticated

↓

Store user in Redux

↓

Allow Protected Routes

↓

Render Application

If unauthenticated

↓

Redirect Login

---

# Hydration

Create a hydration process.

Example

App

↓

HydrateAuth()

↓

GET /auth/me

↓

dispatch(setCurrentUser())

↓

hydrationComplete = true

Protected Routes should NEVER render until hydration finishes.

---

# Auth Hydration State

Inside Auth Slice create:

isAuthenticated

currentUser

isHydrating

hydrationCompleted

authChecked

Example lifecycle

App Starts

↓

isHydrating = true

↓

GET /auth/me

↓

Success

↓

currentUser = response.user

↓

isAuthenticated = true

↓

hydrationCompleted = true

↓

Protected Routes unlocked

Failure

↓

currentUser = null

↓

isAuthenticated = false

↓

hydrationCompleted = true

↓

Redirect Login

---

# Protected Route Logic

Never check cookies directly.

Never check LocalStorage.

Protected Route should only check

hydrationCompleted

AND

isAuthenticated

Pseudo flow

if (!hydrationCompleted)

    return <PageLoader />

if (!isAuthenticated)

    return <Navigate to="/login" />

return children

This prevents flickering.

---

# Guest Route Logic

If hydration finishes

AND

isAuthenticated

↓

Redirect Home

Login/Register pages should never appear for authenticated users.

---

# Silent Authentication

Implement completely invisible authentication.

User should never notice

Access Token expired

↓

Axios receives 401

↓

Automatically call

POST

/auth/refresh-access-token

↓

Backend creates new Access Token

↓

Update Cookies

↓

Retry failed request

↓

User continues normally

No redirect

No loading

No popup

No toast

No refresh

---

# Automatic Refresh Queue

Support multiple simultaneous requests.

Example

10 requests

↓

Access Token expired

↓

All return 401

↓

ONE refresh request only

↓

Remaining requests wait

↓

Refresh succeeds

↓

Retry all queued requests

↓

Success

Never send

10 refresh requests.

---

# Refresh Token Expiration

Only if

/auth/refresh-access-token

fails

↓

Clear Cookies

↓

Clear Redux

↓

Disconnect Socket

↓

Reject Queue

↓

Redirect Login

Only then should the user log in again.

---

# Redux During Refresh

Never clear Redux while refreshing.

User state should remain.

Only replace tokens.

Redux should only reset when Refresh Token becomes invalid.

---

# Socket.IO Integration

If refresh generates a new Access Token

↓

Update

socket.auth.token

↓

Reconnect socket automatically

↓

Continue receiving notifications

User should never notice.

---

# Axios Requirements

Implement

Request Interceptor

Response Interceptor

Retry Queue

Refresh Queue

Retry Flag

Infinite Loop Protection

Only one refresh request.

No race conditions.

No duplicated retries.

---

# Hydration After Refresh

When

/auth/refresh-access-token

returns a new Access Token

Immediately call

GET /auth/me

if needed to ensure Redux always contains the latest authenticated user.

Backend remains the source of truth.

---

# Browser Refresh

When user presses

F5

or

Ctrl + R

Application should

Start

↓

Hydrate

↓

GET /auth/me

↓

Restore Redux

↓

Continue normally

No login screen.

---

# Browser Restart

Browser reopened

↓

Cookies still valid

↓

GET /auth/me

↓

Restore Redux

↓

Continue normally

---

# Logout Flow

Logout

↓

POST /auth/logout

↓

Backend blacklists Refresh Token

↓

Clear Cookies

↓

Clear Redux

↓

Disconnect Socket

↓

Redirect Login

---

# Verification Checklist

Verify at least four times:

✓ Redux hydrates from /auth/me

✓ Protected Routes wait for hydration

✓ No route flickering

✓ Access Token refresh is completely silent

✓ Only one refresh request is sent

✓ Failed requests are queued

✓ Requests retry automatically

✓ Socket reconnects automatically

✓ Redux remains intact during refresh

✓ Logout only occurs when Refresh Token expires

✓ No race conditions

✓ No duplicate requests

✓ No infinite Axios loops

✓ No React warnings

✓ No TypeScript errors

The final behavior should be indistinguishable from production applications like Instagram, GitHub, LinkedIn, Discord, and Notion.