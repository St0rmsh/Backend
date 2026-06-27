- [x] Component 1: Project Foundation & Config
  - [x] Update `index.html` (dark class, Google Fonts, title, meta)
  - [x] Update `vite.config.ts` (if needed)
  - [x] Update `tailwind.config.js` (success color, font fallbacks)
  - [x] Create `src/app/config/env.ts`

- [x] Component 2: Design System (Styles)
  - [x] Move `src/index.css` to `src/styles/index.css`
  - [x] Update dark theme as default, refine colors, custom scrollbar

- [x] Component 3: Shared Types & Constants
  - [x] Move and update `api.types.ts`
  - [x] Move `user.types.ts`
  - [x] Create `routes.ts`
  - [x] Create `api.ts`
  - [x] Move and rename `cookies.ts` (constants)

- [x] Component 4: Shared Utilities & Libraries
  - [x] Move and update `axios.ts`
  - [x] Move `cookies.ts` (lib)
  - [x] Move and update `socket.ts`
  - [x] Move `utils.ts`
  - [x] Move and update `errorHandler.ts`
  - [x] Move `passwordStrength.ts`

- [x] Component 5: Shared Hooks
  - [x] Move and split Redux hooks (`useAppDispatch`, `useAppSelector`)
  - [x] Create `useCapsLock.ts`

- [x] Component 6: Shared UI Components
  - [x] Move existing shadcn components
  - [x] Create `password-input.tsx`
  - [x] Create `otp-input.tsx`
  - [x] Create `skeleton.tsx`
  - [x] Create `dialog.tsx`
  - [x] Create `textarea.tsx`
  - [x] Create `ErrorState.tsx`
  - [x] Create `EmptyState.tsx`
  - [x] Create `PageLoader.tsx`
  - [x] Create `PageTransition.tsx`

- [x] Component 7: Redux Store
  - [x] Create `store/index.ts`
  - [x] Create `uiSlice.ts`
  - [x] Create `socketSlice.ts`
  - [x] Create `loadingSlice.ts`
  - [x] Modify `authSlice.ts`
  - [x] Modify `authThunks.ts`

- [ ] Component 8: Routing & Guards
  - [ ] Create `routes/index.tsx`
  - [ ] Create `GuestGuard.tsx`
  - [ ] Create `AuthGuard.tsx`
  - [ ] Create `GuestLayout.tsx`
  - [ ] Create `AuthenticatedLayout.tsx`

- [ ] Component 9: Auth Feature Refactor
  - [ ] Update Auth forms
  - [ ] Update Auth pages
  - [ ] Rewrite `AvatarUploader.tsx`
  - [ ] Rewrite `BannerUploader.tsx`
  - [ ] Delete replaced files and folders

- [ ] Component 10: New Pages
  - [ ] Create `HomePage.tsx`
  - [ ] Create `NotFoundPage.tsx`
  - [ ] Create `ProfilePage.tsx`

- [ ] Component 11: App Entry Point
  - [ ] Modify `main.tsx`
  - [ ] Create `App.tsx`
  - [ ] Delete old App files

- [ ] Component 12: Package Installation
  - [ ] Install `react-dropzone`
  - [ ] Install `@radix-ui/react-dialog`