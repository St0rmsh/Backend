import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";
import { AUTH_MESSAGES } from "../constants/authMessages";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "./PasswordInput";

export const LoginForm = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-2 relative group">
        <Input
          id="email"
          type="email"
          placeholder=" "
          className="pt-6 pb-2 peer"
          {...register("email")}
        />
        <Label 
          htmlFor="email"
          className="absolute left-3 top-4 text-muted-foreground transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
        >
          Email address
        </Label>
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2 relative group">
        <PasswordInput
          id="password"
          placeholder=" "
          className="pt-6 pb-2 peer"
          {...register("password")}
        />
        <Label 
          htmlFor="password"
          className="absolute left-3 top-4 text-muted-foreground transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
        >
          Password
        </Label>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          {/* Checkbox can go here if needed */}
        </div>
        <Link 
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-accent hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
      </Button>
    </form>
  );
};
