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
            path: ROUTES.LOGIN,
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <LoginPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: ROUTES.REGISTER,
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <RegisterPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: ROUTES.FORGOT_PASSWORD,
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <ForgotPasswordPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: ROUTES.RESET_PASSWORD,
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <ResetPasswordPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: ROUTES.VERIFY_OTP,
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <VerifyOtpPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: ROUTES.CHANGE_PASSWORD,
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
            element: <Navigate to={ROUTES.PROFILE_SETTINGS} replace />,
          },
          {
            path: ROUTES.PROFILE_SETTINGS,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfileSettingsPage />
              </Suspense>
            ),
          },
          // TODO: Add other settings routes
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
