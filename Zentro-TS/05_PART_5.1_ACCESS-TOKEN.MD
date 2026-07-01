# Production-Ready Automatic Access Token Refresh (Mandatory)

## Objective

Implement a completely automatic authentication lifecycle identical to modern production applications such as:

* Instagram
* Facebook
* Threads
* LinkedIn
* GitHub
* X (Twitter)

The authentication system must be invisible to the user.

The user must **never know** that the Access Token has expired.

There should be:

* No loading screen
* No popup
* No toast
* No redirect
* No modal
* No flickering
* No duplicated API requests

Unless the user explicitly logs out or the Refresh Token expires, the user should continue using the application without interruption.

---

# Authentication Lifecycle

```
Login

↓

Receive

Access Token
Refresh Token

↓

Store both securely inside Cookies

↓

User uses the application normally

↓

Access Token expires

↓

Some protected API returns 401 Unauthorized

↓

Axios Response Interceptor detects expired Access Token

↓

Automatically call

POST /auth/refresh-access-token

↓

Backend validates Refresh Token

↓

Generate new Access Token

↓

(Optional)
Generate new Refresh Token
(Token Rotation)

↓

Frontend updates Cookies automatically

↓

Retry ONLY the original failed request

↓

Return response to component

↓

User continues using the application

↓

User never notices anything happened
```

---

# Important Requirement

The original request must continue automatically.

Example

```
User clicks Feed

↓

GET /posts?page=1

↓

401

↓

Refresh Access Token

↓

Retry GET /posts?page=1

↓

200

↓

Render Feed
```

The user clicked only once.

Never require the user to click again.

---

# Refresh Rules

Only ONE refresh request may exist at any time.

If ten API requests fail simultaneously because the Access Token expired:

Wrong

```
Refresh

Refresh

Refresh

Refresh

Refresh
```

Correct

```
Refresh

↓

Queue every failed request

↓

Refresh succeeds

↓

Retry every queued request
```

Exactly ONE refresh request.

Never more.

---

# Refresh Queue

Implement a refresh queue.

If refresh is already running:

Do NOT send another refresh request.

Instead

Queue every failed request.

Example

```
Feed

↓

401

↓

Refresh starts


Meanwhile

Notifications

↓

401

↓

Queue


Profile

↓

401

↓

Queue


Bookmarks

↓

401

↓

Queue


Refresh succeeds

↓

Retry Feed

Retry Notifications

Retry Profile

Retry Bookmarks
```

No duplicated refresh requests.

---

# Request Queue Rules

All failed requests should wait until refresh finishes.

If refresh succeeds

Retry every queued request automatically.

If refresh fails

Reject every queued request.

Clear queue.

Logout user.

---

# Request Deduplication

Never duplicate API requests.

Every request should only execute once.

Example

Wrong

```
GET /posts

GET /posts

GET /posts
```

Correct

```
GET /posts

↓

401

↓

Refresh

↓

Retry GET /posts

↓

Success
```

Never retry requests that already succeeded.

Retry only failed requests.

---

# Retry Protection

Every request must contain an internal retry flag.

Example

```
_request._retry = true
```

If retry already happened

Never retry again.

Prevent infinite loops.

---

# Axios Requirements

Implement one centralized Axios instance.

Implement

* Request Interceptor
* Response Interceptor
* Refresh Queue
* Retry Queue
* Token Update
* Queue Processing
* Logout Handler
* Infinite Loop Protection

Never create multiple axios instances.

Never refresh manually from components.

Everything should happen inside Axios.

---

# Silent Authentication

The refresh process must be completely invisible.

Never show

* Toast
* Popup
* Modal
* Redirect
* Loading Screen
* Authentication Expired Message

The application should continue normally.

Exactly like Instagram.

---

# Socket.IO Integration

Socket authentication must always use the latest Access Token.

Flow

```
Access Token Refreshed

↓

Update socket.auth.token

↓

Disconnect Socket

↓

Reconnect Socket

↓

Continue receiving events
```

The user should never notice reconnection.

Reconnect only after successful refresh.

---

# Redux Rules

Redux must remain intact.

Do NOT clear Redux while refreshing.

Only clear Redux when

* Refresh Token expired
* Logout
* Authentication becomes invalid

The authenticated user should remain inside Redux during refresh.

---

# Cookie Handling

Store

* Access Token
* Refresh Token

inside Cookies.

Never use LocalStorage.

Architecture must also support future HttpOnly Cookies without code changes.

---

# Refresh Token Rotation

Support both backend implementations.

Case 1

Backend returns only

```
Access Token
```

Update only Access Token.

---

Case 2

Backend returns

```
Access Token

Refresh Token
```

Replace both tokens automatically.

Frontend must not require any changes if backend later enables Refresh Token Rotation.

---

# Authentication Failure

If

```
POST /auth/refresh-access-token
```

returns

```
401

403

Invalid Refresh Token

Expired Refresh Token
```

Immediately

```
Clear Cookies

↓

Clear Redux

↓

Disconnect Socket

↓

Clear Request Queue

↓

Reject Pending Requests

↓

Redirect Login
```

Never retry refresh again.

---

# Logout

Logout should happen ONLY when

* User manually logs out

OR

* Refresh Token expired

Never logout because Access Token expired.

---

# Concurrent Requests

Example

```
Feed

Notifications

Profile

Bookmarks

Trending

Explore

Stories

Messages
```

All receive

```
401
```

Implementation must perform

```
ONE Refresh

↓

Retry all queued requests

↓

Done
```

Never perform multiple refresh requests.

---

# Race Condition Protection

Prevent

* Duplicate refresh requests
* Duplicate API retries
* Queue corruption
* Simultaneous token updates
* Infinite interceptor recursion

The refresh queue must be thread-safe and deterministic.

---

# UI Behavior

The UI should continue displaying the previous screen.

Never flash

* Blank Screen
* White Screen
* Skeleton
* Spinner
* Login Page

unless Refresh Token expired.

---

# Performance Requirements

The refresh mechanism must

* Execute only when necessary
* Avoid unnecessary re-renders
* Avoid duplicate network traffic
* Avoid unnecessary Redux updates
* Keep memory usage minimal

---

# Security Requirements

Protect against

* Infinite refresh loops
* Silent authentication bypass
* Multiple refresh attacks
* Replay of expired tokens
* Queue manipulation
* Stale Access Tokens

---

# Production Requirements

Implementation must be

* Production Ready
* Scalable
* Maintainable
* Race-condition free
* Thread-safe
* Future-proof
* Compatible with Refresh Token Rotation
* Compatible with HttpOnly Cookies
* Compatible with Socket.IO Authentication

---

# Verification Checklist

Before completing implementation verify at least four times

✓ User never notices Access Token expiration

✓ Only one refresh request is ever sent

✓ Failed requests are queued correctly

✓ Successful requests are never duplicated

✓ Original request retries automatically

✓ Queue is cleared correctly

✓ Socket reconnects with latest token

✓ Redux remains intact during refresh

✓ Refresh Token Rotation works

✓ Cookies update correctly

✓ No infinite interceptor loops

✓ No duplicated refresh requests

✓ No duplicated API requests

✓ No race conditions

✓ No stale Access Tokens

✓ No silent authentication bypass

✓ No memory leaks

✓ No React warnings

✓ No TypeScript errors

✓ No ESLint errors

The final implementation must behave exactly like the authentication systems used by Instagram, GitHub, LinkedIn, Facebook, Threads, and X, providing a seamless user experience where authentication is entirely transparent until the Refresh Token itself expires.


## Network Recovery

If the network is temporarily unavailable while refreshing the Access Token:

- Do NOT immediately logout.
- Pause all queued requests.
- Wait until the browser comes back online.
- Retry the refresh request automatically.
- Continue the queued requests.

Only logout if the Refresh Token is actually invalid.


## Multi-Tab Authentication Synchronization

Authentication state must stay synchronized across all browser tabs.

Examples:

Login in one tab
↓

Other tabs become authenticated automatically.

Logout in one tab
↓

All tabs logout immediately.

Refresh Token updated
↓

All tabs receive the updated token.

Never allow stale authentication across tabs.



## Request Cancellation

If multiple identical requests are triggered simultaneously:

Example

GET /posts?page=1

GET /posts?page=1

GET /posts?page=1

Automatically cancel or merge duplicate requests.

Never waste network bandwidth.


## Abort Pending Requests

When the user logs out:

Immediately cancel all pending HTTP requests.

Do not allow responses from old authenticated requests to update the UI after logout.


## Page Visibility

When the browser tab is hidden:

Pause unnecessary polling.

Reduce unnecessary socket activity.

When the tab becomes visible:

Resume automatically.



## Idle Session

Detect long periods of inactivity.

While idle:

Do not send unnecessary refresh requests.

Resume normal authentication automatically when the user becomes active again.

Never logout solely because the user was inactive while the Refresh Token remains valid.



## Offline Request Queue

If the user is offline:

Queue requests that require authentication.

When internet returns:

Automatically execute queued requests in order.

Maintain request consistency.



## Duplicate Action Protection

Prevent duplicate user actions.

Examples

Login

Register

Like

Bookmark

Comment

Follow

should never execute twice because of rapid clicks.

Disable the triggering action until the request finishes.




## Socket Synchronization

If authentication changes in another browser tab:

Reconnect Socket.IO automatically using the latest authentication state.

Prevent stale socket connections.



## Future Compatibility

The authentication architecture must support future additions without refactoring:

- Multi-Factor Authentication (MFA)
- Google Login
- GitHub Login
- Apple Login
- Passkeys/WebAuthn
- Biometric Authentication
- Device Trust
- Remember Device
- Session Management



## Safe Component Updates

Never update React state after a component has unmounted.

Cancel subscriptions, timers, and async updates properly to avoid memory leaks.



## Logging

Never expose sensitive authentication information in browser console.

Never log

Access Token

Refresh Token

OTP

Passwords

Email verification codes

Use production-safe logging.




1. Session Restoration ⭐⭐⭐⭐⭐

After page refresh:

Automatically call /auth/me
Restore Redux state
Restore Socket connection
Restore theme
Restore sidebar state

The user should never notice the refresh.



## 2. Automatic Socket.IO Reconnection

When Access Token is refreshed:

- Disconnect Socket.IO
- Reconnect Socket.IO with the new token
- Resume real-time events immediately

Never use stale tokens with Socket.IO.



## 3. Refresh Token Rotation (Future-Proof)

Even if not used immediately, design the system to support:

- Return new Refresh Token along with Access Token
- Seamless token rotation
- Backwards compatible with old backend versions
- No code changes when enabling rotation



## 4. Request Deduplication

If multiple identical requests are triggered:

Example:

GET /posts

GET /posts

GET /posts

- Only send ONE request
- Cancel duplicates automatically
- Prevent unnecessary network usage



## 5. Abort Pending Requests on Logout

When user logs out:

- Cancel ALL pending requests immediately
- Prevent stale responses from updating UI after logout
- Avoid security issues



## 6. Multi-Tab Synchronization

Authentication state must sync across all tabs:

- Login in one tab → others update automatically
- Logout in one tab → all tabs logout
- Refresh token updates everywhere

Never allow stale authentication in other tabs.



## 7. Network Recovery

If network is temporarily down:

- Do NOT logout
- Queue requests
- Retry automatically when network returns
- Continue automatically when connection restored



## 8. Page Visibility Management

When tab is hidden:

- Pause unnecessary polls
- Reduce socket activity
- Resume automatically when visible

Optimizes battery and bandwidth.



## 9. Idle Session Handling

If user is idle:

- Do not send unnecessary refresh requests
- Resume automatically when user becomes active
- Only logout if Refresh Token is actually invalid



## 10. Offline Request Queue

If user is offline:

- Queue authenticated requests
- Execute automatically when internet returns
- Maintain request order and consistency



## 11. Safe Component Updates

Never update component state after unmount:

- Cancel subscriptions, timers, async operations
- Prevent memory leaks
- Maintain performance



## 12. Production-Safe Logging

Never log sensitive data:

❌ Access Token

❌ Refresh Token

❌ Passwords

❌ OTP codes

❌ Verification codes

Use environment-specific logging only.



## 13. Duplicate Action Protection

Prevent duplicate actions:

- Like
- Comment
- Follow
- Post
- Login
- Register

Disable buttons during request submission.


