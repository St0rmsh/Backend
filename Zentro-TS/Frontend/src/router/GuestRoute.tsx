import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/shared/hooks";
import { ROUTES } from "./routes.config";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Guest Route Component
 * Only allows non-authenticated users to access the route
 * Redirects to home if user is already authenticated
 */
export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Already authenticated - redirect to home
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};
