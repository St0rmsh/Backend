import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordSchema, ResetPasswordFormData } from "../schemas/resetPassword.schema";
import { authService } from "../services/auth.service";
import { AUTH_MESSAGES } from "../constants/authMessages";
import { ROUTES } from "@/shared/constants/routes";
import { handleApiError as handleAuthError } from "@/shared/utils/errorHandler";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
    },
  });

  const password = watch("newPassword");

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await authService.resetPassword(data);
      toast.success(AUTH_MESSAGES.RESET_PASSWORD_SUCCESS);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error(handleAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-2 relative">
        <Input
          id="email"
          type="email"
          placeholder=" "
          className="pt-6 pb-2 peer bg-muted"
          disabled
          {...register("email")}
        />
        <Label 
          htmlFor="email"
          className="absolute left-3 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary"
        >
          Email address
        </Label>
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2 relative">
        <Input
          id="otp"
          placeholder=" "
          maxLength={6}
          className="pt-6 pb-2 peer tracking-widest"
          {...register("otp")}
        />
        <Label 
          htmlFor="otp"
          className="absolute left-3 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary"
        >
          6-Digit OTP
        </Label>
        {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
      </div>

      <div className="space-y-2 relative">
        <PasswordInput
          id="newPassword"
          placeholder=" "
          className="pt-6 pb-2 peer"
          {...register("newPassword")}
        />
        <Label 
          htmlFor="newPassword"
          className="absolute left-3 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary"
        >
          New Password
        </Label>
        <PasswordStrengthMeter password={password} />
        {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
      </div>

      <div className="space-y-2 relative">
        <PasswordInput
          id="confirmPassword"
          placeholder=" "
          className="pt-6 pb-2 peer"
          {...register("confirmPassword")}
        />
        <Label 
          htmlFor="confirmPassword"
          className="absolute left-3 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary"
        >
          Confirm New Password
        </Label>
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
      </Button>
    </form>
  );
};
