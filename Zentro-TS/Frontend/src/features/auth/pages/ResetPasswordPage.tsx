import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { AUTH_ROUTES } from "../constants/authRoutes";

export const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <AuthCard
        title="Set New Password"
        description="Enter the OTP sent to your email and choose a new password."
        footer={
          <span>
            Back to{" "}
            <Link to={AUTH_ROUTES.LOGIN} className="text-accent hover:underline">
              Sign in
            </Link>
          </span>
        }
      >
        <ResetPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
};
