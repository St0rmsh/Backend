import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { PageLoader } from "@/shared/components/PageLoader";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { ROUTES } from "./routes.config";

// Layout imports
import { RootLayout } from "@/layouts/RootLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { SettingsLayout } from "@/layouts/SettingsLayout";
import { ErrorLayout } from "@/layouts/ErrorLayout";

// ============================================================================
// LAZY LOADED AUTH PAGES
// ============================================================================

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  }))
);

const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  }))
);

const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);

const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  }))
);

const VerifyOtpPage = lazy(() =>
  import("@/features/auth/pages/VerifyOtpPage").then((m) => ({
    default: m.VerifyOtpPage,
  }))
);

const ChangePasswordPage = lazy(() =>
  import("@/features/auth/pages/ChangePasswordPage").then((m) => ({
    default: m.ChangePasswordPage,
  }))
);

const ProfileSettingsPage = lazy(() =>
  import("@/features/auth/pages/ProfileSettingsPage").then((m) => ({
    default: m.ProfileSettingsPage,
  }))
);

// ============================================================================
// LAZY LOADED PROFILE PAGES
// ============================================================================

const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  }))
);

const SettingsPage = lazy(() =>
  import("@/features/profile/pages/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  }))
);

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

export const routes: RouteObject[] = [
  // Root Layout
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Auth Routes (Guest Only)
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <LoginPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "register",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <RegisterPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <ForgotPasswordPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "reset-password/:token",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <ResetPasswordPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "verify-otp",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <VerifyOtpPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "change-password",
            element: (
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ChangePasswordPage />
                </Suspense>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Main Routes (Protected)
      {
        path: "app",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.FEED} replace />,
          },
          // Profile Routes
          {
            path: "profile",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage isOwnProfile />
              </Suspense>
            ),
          },
          {
            path: "profile/:username",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          // TODO: Add feed, explore, posts, etc. routes here
        ],
      },

      // Settings Routes (Protected)
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfileSettingsPage />
              </Suspense>
            ),
          },
        ],
      },

      // Error Routes
      {
        element: <ErrorLayout />,
        children: [
          {
            path: ROUTES.UNAUTHORIZED,
            element: <div>401 - Unauthorized</div>,
          },
          {
            path: ROUTES.FORBIDDEN,
            element: <div>403 - Forbidden</div>,
          },
          {
            path: ROUTES.NOT_FOUND,
            element: <div>404 - Not Found</div>,
          },
        ],
      },

      // Catch-all redirect
      {
        path: ROUTES.NOT_FOUND,
        element: <Navigate to={ROUTES.LOGIN} replace />,
      },
    ],
  },
];
