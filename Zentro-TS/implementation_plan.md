# Zentro Frontend — Stage 1: Authentication Foundation

Complete restructure of the existing frontend into a strict 4-layer architecture with production-level authentication, dark-first design, and scalable foundations.

## Current State Assessment

The existing codebase has a basic auth feature with functional code but several architectural issues:

- **Flat structure** — no `app/`, `shared/`, `store/` layers; everything lives ad-hoc in `features/auth/` and root `src/`
- **No route guards** — any user can access any page
- **No lazy loading / Suspense** — all pages eagerly imported
- **No layouts via routing** — `AuthLayout` is used inside each page, not as a route-level layout
- **Axios instance buried** inside `features/auth/utils/` — should be a shared service
- **Cookie utils, error handlers** inside `features/auth/utils/` — these are shared concerns
- **No `User Slice` / `UI Slice` / `Socket Slice` / `Loading Slice`** — only one `authSlice`
- **Dark mode not default** — current CSS is light-first with a `.dark` class
- **`api.types.ts` uses `any`** — violates strict TypeScript
- **`ForgotPasswordForm` / `ChangePasswordForm` / `ResetPasswordForm`** call `authService` directly from components — violates the "no API inside components" rule
- **Socket.IO** — a bare singleton with no service layer, no Redux integration
- **Missing shared UI components** — no Loader, Skeleton, Dialog, Modal, Error State, Empty State, etc.
- **No 404 page, no profile page, no home placeholder**
- **`index.html` title** says "frontend" — needs SEO
- **No Google Font import** (Inter configured in Tailwind but not loaded)

---

## User Review Required

> [!IMPORTANT]
> **Base URL Discrepancy**: The existing `axiosInstance.ts` uses `/api/v1` as the base path (matching backend routes like `/api/v1/auth/login`). Your spec says `http://localhost:3000/api`. The backend routes are mounted at `/api/v1/`. I will keep `/api/v1` to match your actual backend. Please confirm.

> [!IMPORTANT]
> **Dark-First Default**: The spec says "Dark First design". I will make dark mode the default (applied via `class="dark"` on `<html>`) with no light/dark toggle in Stage 1. The light theme CSS variables will be preserved for future use. Agree?

> [!WARNING]
> **Destructive Refactor**: This restructures the entire `src/` directory tree. Existing `features/auth/utils/` files (`axiosInstance.ts`, `cookies.ts`, `authErrorHandler.ts`, `passwordStrength.ts`) will be moved to `shared/`. The `App/` directory will be reorganized into `app/`. All import paths will change.

---

## Open Questions

> [!IMPORTANT]
> **Home Page Placeholder**: For authenticated users, `/` needs a landing page. Since feed/posts are Stage 2+, should I create a minimal "Welcome to Zentro" dashboard placeholder, or redirect `/` to `/settings` (profile) for now?

> [!IMPORTANT]
> **`react-dropzone` package**: Your spec says to use React Dropzone for uploads. The current `package.json` does NOT include `react-dropzone`. I will install it and rewrite `AvatarUploader` and `BannerUploader` to use it with drag-drop, progress bar, and validation. Confirm?

---

## Proposed Changes

### Target Directory Structure

```
src/
├── app/
│   ├── App.tsx                    # Root component
│   ├── config/
│   │   └── env.ts                 # Environment config constants
│   └── routes/
│       ├── index.tsx              # Route definitions with lazy loading
│       ├── guards/
│       │   ├── GuestGuard.tsx     # Redirects auth'd users away from login/register
│       │   └── AuthGuard.tsx      # Redirects guests away from protected pages
│       └── layouts/
│           ├── GuestLayout.tsx    # Layout for auth pages (hero + card)
│           └── AuthenticatedLayout.tsx  # Layout for logged-in pages (sidebar/nav)
├── features/
│   └── auth/
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── ForgotPasswordPage.tsx
│       │   ├── ResetPasswordPage.tsx
│       │   ├── VerifyEmailPage.tsx
│       │   ├── ChangePasswordPage.tsx
│       │   ├── ProfilePage.tsx
│       │   └── SettingsPage.tsx
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   ├── ForgotPasswordForm.tsx
│       │   ├── ResetPasswordForm.tsx
│       │   ├── VerifyOtpForm.tsx
│       │   ├── ChangePasswordForm.tsx
│       │   ├── ProfileForm.tsx
│       │   ├── AuthHero.tsx
│       │   ├── AuthCard.tsx
│       │   └── SessionExpiryModal.tsx
│       ├── services/
│       │   ├── auth.service.ts
│       │   └── profile.service.ts
│       ├── state/
│       │   ├── authSlice.ts
│       │   ├── authThunks.ts
│       │   ├── authSelectors.ts
│       │   └── authInitialState.ts
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useCurrentUser.ts
│       │   └── useSessionMonitor.ts
│       ├── schemas/
│       │   ├── login.schema.ts
│       │   ├── register.schema.ts
│       │   ├── forgotPassword.schema.ts
│       │   ├── resetPassword.schema.ts
│       │   ├── changePassword.schema.ts
│       │   └── profile.schema.ts
│       └── types/
│           └── auth.types.ts
├── shared/
│   ├── components/
│   │   ├── ErrorState.tsx
│   │   ├── EmptyState.tsx
│   │   ├── PageLoader.tsx
│   │   └── PageTransition.tsx
│   ├── layouts/          (reserved for shared layout primitives)
│   ├── ui/               (shadcn/ui components — moved from components/ui)
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── password-input.tsx
│   │   ├── otp-input.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   └── textarea.tsx
│   ├── hooks/
│   │   ├── useAppDispatch.ts
│   │   ├── useAppSelector.ts
│   │   └── useCapsLock.ts
│   ├── lib/
│   │   ├── axios.ts         # Shared axios instance
│   │   ├── cookies.ts       # Cookie utilities
│   │   ├── socket.ts        # Socket.IO service
│   │   └── utils.ts         # cn() utility
│   ├── services/            (reserved for future shared services)
│   ├── utils/
│   │   ├── errorHandler.ts
│   │   └── passwordStrength.ts
│   ├── constants/
│   │   ├── routes.ts        # All app route paths
│   │   ├── api.ts           # API base URL, endpoints
│   │   └── cookies.ts       # Cookie key names
│   └── types/
│       ├── api.types.ts     # ApiResponse<T>, ApiErrorResponse
│       └── user.types.ts    # User interface
├── store/
│   ├── index.ts             # configureStore + RootState + AppDispatch
│   └── slices/
│       ├── uiSlice.ts       # theme, sidebar, modals
│       ├── socketSlice.ts   # connection status
│       └── loadingSlice.ts  # global loading states
├── styles/
│   └── index.css            # Tailwind + CSS variables + dark-first theme
└── main.tsx
```

---

### Component 1: Project Foundation & Config

Foundational files that everything depends on.

#### [MODIFY] [index.html](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/index.html)
- Add `class="dark"` to `<html>` for dark-first default
- Add Google Fonts preconnect + Inter font import
- Update `<title>` to "Zentro — AI-Powered Blog Platform"
- Add meta description, charset, viewport

#### [MODIFY] [vite.config.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/vite.config.ts)
- No major changes needed; proxy and alias config are correct

#### [MODIFY] [tailwind.config.js](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/tailwind.config.js)
- Add `success` color token to the theme colors
- Ensure `fontFamily.sans` includes proper fallbacks

#### [NEW] [env.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/app/config/env.ts)
- Centralized environment constants: `API_BASE_URL`, `SOCKET_URL`, `IS_PRODUCTION`

---

### Component 2: Design System (Styles)

#### [MODIFY → MOVE] [index.css](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/styles/index.css)
- Move from `src/index.css` to `src/styles/index.css`
- Redesign dark theme as default (swap light/dark variable definitions)
- Refine color palette: darker backgrounds (true blacks, zinc-950), subtle borders
- Add accent gradient variables for subtle button/link highlights
- Add custom scrollbar styles
- Add focus ring utilities
- Ensure all CSS variables support the dark-first Instagram/Linear/Notion/Vercel aesthetic

---

### Component 3: Shared Types & Constants

#### [MOVE + MODIFY] [api.types.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/types/api.types.ts)
- Move from `features/auth/types/`
- **Fix the `any` type** — replace `ApiResponse<T = any>` with `ApiResponse<T = unknown>`

#### [MOVE] [user.types.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/types/user.types.ts)
- Move from `features/auth/types/` — User is a shared type, not auth-specific

#### [NEW] [routes.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/constants/routes.ts)
- All application route paths (expands on existing `authRoutes.ts`)
- Add `PROFILE: "/profile"`, `NOT_FOUND: "/404"`, `VERIFY_EMAIL: "/verify-email"`

#### [NEW] [api.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/constants/api.ts)
- API base URL and endpoint path constants

#### [MOVE + RENAME] [cookies.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/constants/cookies.ts)
- Move auth key constants from `features/auth/constants/authKeys.ts`

---

### Component 4: Shared Utilities & Libraries

#### [MOVE + MODIFY] [axios.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/lib/axios.ts)
- Move from `features/auth/utils/axiosInstance.ts`
- Import base URL from `app/config/env.ts`
- Fix `any` types in the interceptor queue
- Add proper TypeScript typing for `_retry` via module augmentation on `InternalAxiosRequestConfig`
- Use `store.dispatch` for logout on refresh failure (instead of `window.location.href`)
- Add request ID header for debugging

#### [MOVE] [cookies.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/lib/cookies.ts)
- Move from `features/auth/utils/cookies.ts`
- Import key names from `shared/constants/cookies.ts`

#### [MOVE + MODIFY] [socket.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/lib/socket.ts)
- Move from `src/lib/socket.ts`
- Create a proper `SocketService` class with:
  - `connect(token: string)` — sets auth and connects
  - `disconnect()` — removes all listeners and disconnects
  - `removeAllCustomListeners()` — cleanup helper
  - `onConnectionChange(callback)` — for Redux integration
  - Auto-reconnect with exponential backoff
  - No duplicate listener registration
  - No memory leaks

#### [MOVE] [utils.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/lib/utils.ts)
- Move from `src/lib/utils.ts`

#### [MOVE + MODIFY] [errorHandler.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/utils/errorHandler.ts)
- Move from `features/auth/utils/authErrorHandler.ts`
- Generalize for reuse across all features (not just auth)

#### [MOVE] [passwordStrength.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/utils/passwordStrength.ts)
- Move from `features/auth/utils/passwordStrength.ts`

---

### Component 5: Shared Hooks

#### [MOVE + SPLIT] Redux hooks
- Move from `src/hooks/reduxHooks.ts`
- Create `shared/hooks/useAppDispatch.ts` and `shared/hooks/useAppSelector.ts`
- Export from a barrel `shared/hooks/index.ts`

#### [NEW] [useCapsLock.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/hooks/useCapsLock.ts)
- Detects Caps Lock state for password fields
- Returns `isCapsLockOn: boolean`

---

### Component 6: Shared UI Components

All existing shadcn components moved from `src/components/ui/` to `src/shared/ui/`.

#### [MOVE] Existing shadcn components
- `avatar.tsx`, `button.tsx`, `card.tsx`, `dropdown-menu.tsx`, `form.tsx`, `input.tsx`, `label.tsx`, `separator.tsx`

#### [NEW] [password-input.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/ui/password-input.tsx)
- Move from `features/auth/components/PasswordInput.tsx` and promote to shared
- Add Caps Lock detection badge
- Add proper ARIA labels

#### [NEW] [otp-input.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/ui/otp-input.tsx)
- Reusable 6-digit OTP input with auto-advance, paste support, backspace navigation
- Extracted from `VerifyOtpForm` into a standalone component
- Keyboard accessible, screen reader friendly

#### [NEW] [skeleton.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/ui/skeleton.tsx)
- Animated skeleton loader for content placeholders

#### [NEW] [dialog.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/ui/dialog.tsx)
- Radix UI Dialog wrapper (for modals)

#### [NEW] [textarea.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/ui/textarea.tsx)
- Styled textarea matching the design system (for bio field)

#### [NEW] [ErrorState.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/components/ErrorState.tsx)
- Reusable error display with retry button

#### [NEW] [EmptyState.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/components/EmptyState.tsx)
- Reusable empty state with icon + message + optional CTA

#### [NEW] [PageLoader.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/components/PageLoader.tsx)
- Full-page loading spinner for Suspense fallback and initial auth check

#### [NEW] [PageTransition.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/components/PageTransition.tsx)
- Framer Motion wrapper for page-level fade/slide transitions

---

### Component 7: Redux Store

#### [NEW] [store/index.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/store/index.ts)
- Move from `src/store.ts`
- Combine all reducers: `auth`, `ui`, `socket`, `loading`
- Export `RootState`, `AppDispatch`, `store`
- Add socket middleware for connection status tracking

#### [NEW] [uiSlice.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/store/slices/uiSlice.ts)
- `theme: 'dark' | 'light'` (default `'dark'`)
- `sidebarOpen: boolean`
- `activeModal: string | null`

#### [NEW] [socketSlice.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/store/slices/socketSlice.ts)
- `isConnected: boolean`
- `connectionError: string | null`
- Actions: `setConnected`, `setDisconnected`, `setConnectionError`

#### [NEW] [loadingSlice.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/store/slices/loadingSlice.ts)
- `globalLoading: boolean` — for app-level loading states (initial auth check)
- `operations: Record<string, boolean>` — for tracking specific async operations

#### [MODIFY] [authSlice.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/state/authSlice.ts)
- Remove `any` cast on `action.payload`
- Add typed `resetAuth` action for full state clear
- Add `initialCheckComplete` flag for first-load auth check
- Wire up `forgotPassword`, `resetPassword`, `changePassword`, `sendOtp`, `verifyOtp` thunks

#### [MODIFY] [authThunks.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/state/authThunks.ts)
- Add missing thunks: `forgotPasswordThunk`, `resetPasswordThunk`, `changePasswordThunk`, `sendOtpThunk`, `verifyOtpThunk`
- Logout thunk must dispatch socket disconnect and clear all slices
- Update imports to new shared paths

---

### Component 8: Routing & Guards

#### [NEW] [routes/index.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/app/routes/index.tsx)
- React Router v7 route configuration
- Lazy load all pages with `React.lazy()`
- Wrap in `Suspense` with `PageLoader` fallback
- Nest guest routes under `GuestLayout`
- Nest authenticated routes under `AuthenticatedLayout`
- 404 catch-all route

#### [NEW] [GuestGuard.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/app/routes/guards/GuestGuard.tsx)
- If user IS authenticated → redirect to `/`
- Wraps guest-only routes (login, register, forgot-password, reset-password)

#### [NEW] [AuthGuard.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/app/routes/guards/AuthGuard.tsx)
- If user is NOT authenticated → redirect to `/login`
- Wraps protected routes (settings, profile, change-password, verify-email)

#### [NEW] [GuestLayout.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/app/routes/layouts/GuestLayout.tsx)
- Wraps `<Outlet />` with the auth hero panel + card layout
- Replaces the per-page `<AuthLayout>` usage

#### [NEW] [AuthenticatedLayout.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/app/routes/layouts/AuthenticatedLayout.tsx)
- Minimal nav bar with user avatar, logout button
- `<Outlet />` for page content
- Initializes socket connection on mount
- Cleans up socket on unmount

---

### Component 9: Auth Feature Refactor

#### [MODIFY] Auth forms (`LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `ChangePasswordForm`, `VerifyOtpForm`)
- Update ALL imports to new shared paths (`@/shared/ui/...`, `@/shared/lib/...`)
- `ForgotPasswordForm`, `ResetPasswordForm`, `ChangePasswordForm` → use Redux thunks instead of direct service calls
- Add Framer Motion animated error messages
- Add Caps Lock detection on password fields
- Use new `OtpInput` shared component in `VerifyOtpForm`

#### [MODIFY] Auth pages
- Remove `<AuthLayout>` wrapper from each page (now handled by route-level `GuestLayout`)
- Pages become pure composition: `AuthCard` + Form

#### [MODIFY] [AvatarUploader.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/components/AvatarUploader.tsx)
- Rewrite using `react-dropzone`
- Add file validation (type, size)
- Add upload progress bar animation
- Add image preview with Framer Motion transition

#### [MODIFY] [BannerUploader.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/components/BannerUploader.tsx)
- Rewrite using `react-dropzone`
- Add file validation (type, size)
- Add upload progress indicator
- Add drag-active visual state with Framer Motion

#### [DELETE] `features/auth/constants/authRoutes.ts` → replaced by `shared/constants/routes.ts`
#### [DELETE] `features/auth/constants/authKeys.ts` → replaced by `shared/constants/cookies.ts`
#### [DELETE] `features/auth/utils/axiosInstance.ts` → replaced by `shared/lib/axios.ts`
#### [DELETE] `features/auth/utils/cookies.ts` → replaced by `shared/lib/cookies.ts`
#### [DELETE] `features/auth/utils/authErrorHandler.ts` → replaced by `shared/utils/errorHandler.ts`
#### [DELETE] `features/auth/utils/passwordStrength.ts` → replaced by `shared/utils/passwordStrength.ts`
#### [DELETE] `features/auth/types/api.types.ts` → replaced by `shared/types/api.types.ts`
#### [DELETE] `features/auth/types/user.types.ts` → replaced by `shared/types/user.types.ts`
#### [DELETE] `features/auth/components/AuthLayout.tsx` → replaced by route-level `GuestLayout`
#### [DELETE] `features/auth/components/PasswordInput.tsx` → replaced by `shared/ui/password-input.tsx`

---

### Component 10: New Pages

#### [NEW] [HomePage.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/pages/HomePage.tsx)
- Minimal dashboard placeholder for authenticated users
- Welcome message with user name
- Quick links to profile/settings

#### [NEW] [NotFoundPage.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/shared/components/NotFoundPage.tsx)
- 404 page with animation
- Link back to home

#### [NEW] [ProfilePage.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/auth/pages/ProfilePage.tsx)
- View-only user profile page at `/profile`
- Shows avatar, banner, bio, username, join date

---

### Component 11: App Entry Point

#### [MODIFY] [main.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/main.tsx)
- Update store import to `store/index.ts`
- Update CSS import to `styles/index.css`
- Toaster position and theme for dark mode

#### [NEW] [App.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/app/App.tsx)
- Rewrite to use new route config from `app/routes/`
- Run `useCurrentUser` for initial auth check on mount
- Show `PageLoader` until initial check completes
- Mount `SessionExpiryModal`

#### [DELETE] `src/App/App.tsx`, `src/App/App.css`, `src/App/store.tsx` — replaced by `app/App.tsx`
#### [DELETE] `src/store.ts` — replaced by `store/index.ts`
#### [DELETE] `src/hooks/reduxHooks.ts` — replaced by `shared/hooks/`
#### [DELETE] `src/lib/socket.ts` — replaced by `shared/lib/socket.ts`
#### [DELETE] `src/lib/utils.ts` — replaced by `shared/lib/utils.ts`
#### [DELETE] `src/index.css` — replaced by `styles/index.css`

---

### Component 12: Package Installation

#### Install missing dependency
- `react-dropzone` — for drag-drop file uploads
- `@radix-ui/react-dialog` — for Dialog/Modal component

---

## Verification Plan

### Automated Tests
```bash
cd Frontend && npx tsc --noEmit
```
- TypeScript compilation check — zero errors with `strict: true` and no `any`

```bash
cd Frontend && npm run build
```
- Full production build to catch any import/bundling issues

### Manual Verification
- Start dev server (`npm run dev`) and verify:
  1. App loads with dark theme by default
  2. `/login` page renders with hero + form
  3. Guest cannot navigate to `/settings` — redirected to `/login`
  4. After login, user cannot navigate to `/login` — redirected to `/`
  5. Logout clears all state and redirects to `/login`
  6. 404 page renders for unknown routes
  7. All forms show real-time validation errors
  8. Password strength meter works on register/reset/change password
  9. OTP input accepts paste and auto-advances
  10. Profile page shows user data
  11. Avatar/Banner uploaders accept drag-drop
  12. Page transitions animate smoothly
  13. No console errors or warnings
