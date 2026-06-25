import { Outlet } from "react-router-dom";

/**
 * Auth Layout Component
 * Layout for authentication pages (login, register, reset password, etc.)
 * Provides centered card layout with minimal navigation
 */
export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
