import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "../components/LoginForm";
import { AUTH_ROUTES } from "../constants/authRoutes";

export const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Enter your credentials to access your account."
        footer={
          <span>
            Don't have an account?{" "}
            <Link to={AUTH_ROUTES.REGISTER} className="text-accent hover:underline">
              Sign up
            </Link>
          </span>
        }
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
};
