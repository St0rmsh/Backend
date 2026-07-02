7. Idle Session Monitor ⭐⭐⭐⭐☆

Detect inactivity.

Example:

30 minutes idle

↓

Optional warning

↓

Auto logout only if Refresh Token expired

Future-ready.


13. Global Loading Manager ⭐⭐⭐⭐☆

Instead of every component managing its own loading:

Create:

LoadingSlice

Support:

Page Loading
Button Loading
Section Loading
Overlay Loading



14. Route Prefetching ⭐⭐⭐⭐☆

After login:

Preload:

Feed
Profile
Notifications

Makes navigation feel instant.


15. Socket Authentication Recovery ⭐⭐⭐⭐⭐

If Socket disconnects because the Access Token changed:

Refresh Token

↓

New Access Token

↓

Update socket.auth

↓

Reconnect automatically

No manual reconnect.


18. Optimistic UI Architecture ⭐⭐⭐⭐⭐

Prepare infrastructure for:

Likes
Follow
Bookmark
Notifications

Update UI instantly.

Rollback if the API fails.


14. Route Prefetching ⭐⭐⭐⭐☆

After login:

Preload:

Feed
Profile
Notifications

Makes navigation feel instant.


17. Upload Resume ⭐⭐⭐⭐☆

If the avatar upload fails due to the network:

Resume automatically when the network returns.

Future-ready.



## 14. Authentication Flow Chart (Final)

Create a clear flow diagram:

Login
→ Set Cookies
→ Store Tokens
→ Auth Success
→ Navigate Home



Access Token Expired
→ Queue requests
→ Call POST /auth/refresh-access-token
→ Success → Retry requests
→ Failure → Logout



Logout
→ Clear Cookies
→ Clear Redux
→ Cancel Socket
→ Clear Queue
→ Navigate Login



These additional requirements ensure maximum performance, security, and production readiness while remaining completely backwards compatible with the existing architecture.


6. Global API Request Queue ⭐⭐⭐⭐⭐

Instead of allowing duplicate requests:

Like
Like
Like
Like

Queue or debounce them.

Prevents accidental spam.






# Zentro Backend Fix — Redux Authentication Persistence + Automatic Refresh Token Flow

# Objective

Fix the authentication lifecycle so the frontend behaves like Instagram, GitHub, LinkedIn, and X.

Currently:

- Redux loses the logged-in user after refresh.
- `isAuthenticated` becomes `false`.
- Protected Routes fail.
- Redux DevTools show `user = null`.
- Access Token expiration logs out the user unexpectedly.

Implement a production-ready authentication lifecycle.

---

# Problem 1

## Redux does not persist authenticated user.

Currently after login:

```
accessToken ✔
refreshToken ✔

Redux

user = null

isAuthenticated = false
```

Because of this:

- Protected Routes redirect to Login
- Profile page cannot load
- Settings cannot load
- Private APIs fail
- Socket authentication fails

---

# Required Solution

The frontend must NEVER depend only on Redux.

Redux is temporary memory.

The authentication source of truth is:

Cookies

↓

Current User API

↓

Redux

---

# Application Startup Flow

Whenever the application starts:

```
App Mount

↓

Read Access Token Cookie

↓

If Access Token exists

↓

Call

GET /auth/me

↓

If Success

↓

Store User in Redux

↓

isAuthenticated = true

↓

Render Private Routes
```

---

# If Access Token Does NOT Exist

Automatically attempt silent authentication.

Flow

```
App Mount

↓

Access Token Missing

↓

POST

/auth/refresh-access-token

↓

Receive New Access Token

↓

Store Cookie

↓

GET /auth/me

↓

Store User

↓

Render Application
```

User should never notice.

---

# If Refresh Token is Invalid

Only then

```
Clear Cookies

↓

Clear Redux

↓

Disconnect Socket

↓

Redirect Login
```

---

# Problem 2

## Automatic Access Token Refresh

Implement a production-ready automatic authentication lifecycle.

The user must NEVER manually refresh.

The user must NEVER log in again while Refresh Token is valid.

---

# Authentication Lifecycle

```
Login

↓

Receive

Access Token

Refresh Token

↓

Store both in Cookies

↓

User navigates normally

↓

Access Token expires

↓

Axios Response Interceptor detects 401

↓

POST

/auth/refresh-access-token

↓

Backend validates Refresh Token

↓

Returns New Access Token

(or rotates Refresh Token)

↓

Update Cookies

↓

Retry Original Request

↓

Continue Application

↓

User notices NOTHING
```

---

# Mandatory Rules

The refresh process must be completely silent.

Never show

- Toast
- Popup
- Modal
- Alert
- Loading Overlay
- Redirect

The refresh must happen in the background.

---

# Refresh Queue

If 20 requests fail together

Example

```
GET Posts

GET Comments

GET Notifications

GET Followers

GET Likes

GET Bookmarks
```

DO NOT send

20 refresh requests.

Instead

```
All Requests Fail

↓

Queue Requests

↓

Send ONE

POST /auth/refresh-access-token

↓

Receive New Token

↓

Retry ALL queued requests

↓

Resolve Promises
```

Only one refresh request may exist.

---

# Infinite Loop Protection

Every request must contain

```
_request._retry = true
```

Never refresh twice for the same request.

Never create infinite interceptor loops.

---

# Refresh Token Rotation

Support both backend implementations.

Case 1

Backend returns

```
accessToken
```

Only.

Update Access Token Cookie.

---

Case 2

Backend returns

```
accessToken

refreshToken
```

Automatically replace BOTH cookies.

Do not require frontend refactoring.

---

# Redux Rules

Redux must NEVER be cleared during refresh.

Keep

```
user

isAuthenticated

theme

ui state
```

Only update authentication tokens.

---

# Socket.IO Integration

If Access Token changes

Automatically

```
Update socket.auth.token

↓

Disconnect

↓

Reconnect

↓

Continue Receiving Events
```

User must never notice.

---

# Private Route Rules

Private Routes must NEVER rely only on Redux.

Rules

```
Redux exists

↓

Allow

OR

Access Token Cookie exists

↓

Attempt Silent Refresh

↓

GET /auth/me

↓

Restore Redux

↓

Allow Route
```

---

# Logout Flow

Logout only when

- User clicks Logout

OR

- Refresh Token expires

OR

- Refresh Token becomes invalid

Logout Process

```
POST /auth/logout

↓

Clear Cookies

↓

Reset Redux

↓

Disconnect Socket

↓

Cancel Pending Requests

↓

Clear Refresh Queue

↓

Redirect Login
```

---

# Axios Architecture

Create

```
axiosInstance

↓

Request Interceptor

↓

Response Interceptor

↓

Refresh Queue

↓

Retry Queue

↓

Token Manager

↓

Cookie Manager
```

Everything centralized.

No duplicate axios instances.

---

# Cookie Rules

Store

```
Access Token

Refresh Token
```

inside Cookies only.

Never use LocalStorage.

Architecture must support future HttpOnly Cookies without requiring frontend refactoring.

---

# Current User Synchronization

Whenever

```
Login

Refresh

Profile Update

Password Change
```

Synchronize Redux User.

Never leave stale user data.

---

# Route Guard Rules

Guest Routes

```
Login

Register

Forgot Password

Reset Password
```

Authenticated users should never access them.

---

Protected Routes

```
Feed

Profile

Settings

Notifications

Bookmarks

Write

Dashboard
```

Must always verify authentication correctly.

---

# Error Handling

Handle

401

403

404

500

Offline

Timeout

Refresh Failure

Network Failure

Gracefully.

---

# Production Requirements

Implementation must be identical to

- Instagram
- GitHub
- LinkedIn
- X (Twitter)

The user must never know

- Access Token expired
- Refresh Token rotated
- Socket reconnected

Everything should feel instant.

---

# Verification Checklist

Verify at least 4 times before completion.

✓ Redux always restores after refresh.

✓ User survives browser refresh.

✓ Protected Routes always work.

✓ Access Token refresh is completely silent.

✓ Only ONE refresh request is sent.

✓ Failed requests are queued correctly.

✓ Requests retry automatically.

✓ Refresh Token rotation is supported.

✓ Socket reconnects automatically.

✓ No duplicate API requests.

✓ No race conditions.

✓ No infinite refresh loops.

✓ No duplicated interceptors.

✓ No duplicated Redux state.

✓ No stale user data.

✓ No memory leaks.

✓ Zero TypeScript errors.

✓ Zero React warnings.

✓ Production-ready authentication lifecycle.

Do not finish until every item above works exactly as specified.
