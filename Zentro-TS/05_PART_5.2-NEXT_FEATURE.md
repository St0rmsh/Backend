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







