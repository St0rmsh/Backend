import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

/**
 * Root Layout Component
 * Wraps entire application
 * Provides global providers, toaster, and common UI elements
 */
export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      
      {/* Global Toast Notifications */}
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        expand
      />
    </div>
  );
};
