# Auth Hydration & Silent Authentication

Implement production-ready auth lifecycle per [AUTH_HYDRATION_AND_SILENT_AUTH.md](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/AUTH_HYDRATION_AND_SILENT_AUTH.md). The app must seamlessly restore auth on refresh/restart and silently refresh expired access tokens — identical to Instagram/GitHub/Discord.

## User Review Required

> [!IMPORTANT]
> **httpOnly Cookie Mismatch**: The backend sets cookies as `httpOnly: true` (lines 16–21 of [auth.controller.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/controller/auth.controller.ts#L16-L21)), which means JavaScript (js-cookie) **cannot** read them. However, the current frontend [cookies.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/lib/cookies.ts) uses `js-cookie` to read/write tokens, and [axios.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/lib/axios.ts#L26-L28) adds `Authorization: Bearer` headers from those cookies.
>
> Since the backend reads from `req.cookies` (httpOnly cookies sent automatically by the browser with `withCredentials: true`), the correct approach is:
> - **Remove** all frontend cookie reading/writing via `js-cookie`
> - **Remove** the `Authorization: Bearer` header logic from the request interceptor
> - Let the browser handle cookies automatically (they're httpOnly, so JS can't access them anyway)
> - The refresh endpoint already reads from `req.cookies.refreshToken` — no body payload needed

> [!WARNING]
> **Backend CORS config** in [app.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/app.ts#L15-L19) currently limits `methods` to `["GET","POST"]`. This blocks `PATCH` and `DELETE` requests (used by update-profile, change-password, etc.). I will fix this to allow all needed methods.

> [!WARNING]
> **Refresh endpoint response inconsistency**: The [refreshAccessTokenController](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/controller/auth.controller.ts#L133-L165) returns `data: accessToken` (a raw string), but the frontend interceptor expects `data.data.accessToken` (an object). I will normalize the backend response to `data: { accessToken }`.

## Open Questions

> [!IMPORTANT]
> **Cookie httpOnly**: The plan assumes we keep httpOnly cookies and remove all frontend cookie JS access. The frontend will rely entirely on `withCredentials: true` for cookie transport. **Do you agree with this approach?** If you need JS-accessible cookies (not recommended for security), let me know.

---

## Proposed Changes

### Backend — Auth Controller & CORS

#### [MODIFY] [auth.controller.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/controller/auth.controller.ts)
- Fix `refreshAccessTokenController` to return `data: { accessToken }` instead of `data: accessToken` so the frontend interceptor can parse it consistently.

#### [MODIFY] [app.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/app.ts)
- Update CORS config to allow `PATCH`, `PUT`, `DELETE` methods alongside `GET` and `POST`.

---

### Frontend — Auth Types

#### [MODIFY] [auth.types.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/types/auth.types.ts)
- Add hydration fields to `AuthState`: `isHydrating`, `hydrationCompleted`, `authChecked`
- Remove `accessToken` from state (no longer needed since cookies are httpOnly)

---

### Frontend — Auth Initial State

#### [MODIFY] [authInitialState.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/state/authInitialState.ts)
- Remove cookie reads from initial state
- Set proper defaults: `isHydrating: true`, `hydrationCompleted: false`, `authChecked: false`
- `isAuthenticated` starts as `false` (only set `true` after `/auth/me` succeeds)

---

### Frontend — Auth Slice

#### [MODIFY] [authSlice.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/state/authSlice.ts)
- Remove `initialCheckComplete` field (replaced by `hydrationCompleted`)
- Add `setHydrationComplete`, remove `setInitialCheckComplete`
- Update `fetchCurrentUserThunk` handlers to set hydration flags
- Update `resetAuth` to properly clear everything and set `hydrationCompleted: true`
- Remove `accessToken` references from login/register/logout handlers

---

### Frontend — Auth Selectors

#### [MODIFY] [authSelectors.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/state/authSelectors.ts)
- Add `selectHydrationCompleted`, `selectIsHydrating`, `selectAuthChecked`
- Remove `selectAuthAccessToken`

---

### Frontend — Auth Thunks

#### [MODIFY] [authThunks.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/state/authThunks.ts)
- Add `hydrateAuthThunk` — calls `GET /auth/me`, manages hydration lifecycle
- Remove `setTokens`/`clearTokens` from login/register/logout (backend handles cookies)
- Login/register thunks just return user data; cookies set automatically by backend response
- `logoutThunk` calls `POST /auth/logout` + disconnects socket; cookies cleared by backend

---

### Frontend — Axios Interceptors

#### [MODIFY] [axios.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/lib/axios.ts)
- **Remove** request interceptor `Authorization` header logic (cookies are sent automatically)
- **Update** response interceptor: on 401, call `POST /auth/refresh-access-token` (no body needed — backend reads refreshToken from cookie)
- Keep queue logic but simplify — no need to read/set tokens in JS
- Remove `setTokens`/`clearTokens`/`getAccessToken`/`getRefreshToken` imports
- After successful refresh, update socket token (fetch new token from `/auth/me` is not needed since cookie is set by refresh response)
- On refresh failure: call logout callback, reject queue

---

### Frontend — Cookies Library

#### [MODIFY] [cookies.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/lib/cookies.ts)
- Remove `setTokens`, `getAccessToken`, `getRefreshToken` (no longer accessible)
- Keep only `clearTokens` as a fallback safety mechanism (even though backend clears them)

---

### Frontend — Auth Init Hook (Hydration Entry Point)

#### [MODIFY] [useAuthInit.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/hooks/useAuthInit.ts)
- Replace token-checking logic with a simple hydration flow:
  1. Dispatch `hydrateAuthThunk` (calls `GET /auth/me`)
  2. If succeeds → user is authenticated, connect socket
  3. If fails → user is not authenticated, hydration still completes
- Remove all `getAccessToken`/`getRefreshToken` calls
- Keep cross-tab sync and logout callback registration

---

### Frontend — Protected Route

#### [MODIFY] [ProtectedRoute.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/router/ProtectedRoute.tsx)
- Replace `initialCheckComplete` with `hydrationCompleted`
- Logic: if `!hydrationCompleted` → `<PageLoader />`, if `!isAuthenticated` → redirect login
- Remove `loading` check (loading is for form submissions, not hydration)

---

### Frontend — Guest Route

#### [MODIFY] [GuestRoute.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/router/GuestRoute.tsx)
- Wait for hydration to complete before checking auth
- If `!hydrationCompleted` → `<PageLoader />`, if `isAuthenticated` → redirect home

---

### Frontend — useAuth Hook

#### [MODIFY] [useAuth.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/hooks/useAuth.ts)
- Remove `accessToken` from returned values
- Add `hydrationCompleted` to returned values

---

## Verification Plan

### Manual Verification
1. **Fresh login** → user data appears in Redux, httpOnly cookies set by backend
2. **Refresh page (F5)** → app hydrates via `GET /auth/me`, no login screen flash
3. **Browser restart** → cookies persist, `GET /auth/me` restores session
4. **Access token expiry** → 401 triggers silent refresh, request retries automatically
5. **Multiple simultaneous 401s** → only one refresh request sent, all queued requests retry
6. **Refresh token expiry** → user is redirected to login, Redux is cleared
7. **Logout** → cookies cleared by backend, socket disconnected, Redux reset
8. **Guest pages while logged in** → redirect to home
9. **Protected pages while logged out** → redirect to login, no flicker
10. **Cross-tab logout** → other tabs detect and logout

### Automated Tests
```bash
cd Frontend && npx tsc --noEmit
```
