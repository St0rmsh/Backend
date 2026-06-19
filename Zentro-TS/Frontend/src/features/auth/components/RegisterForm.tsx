import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { registerSchema, RegisterFormData } from "../schemas/register.schema";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";
import { AUTH_MESSAGES } from "../constants/authMessages";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export const RegisterForm = () => {
  const { register: registerAuth, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerAuth(data);
      toast.success(AUTH_MESSAGES.REGISTER_SUCCESS);
      navigate(ROUTES.VERIFY_OTP);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 relative">
          <Input
            id="fullname"
            placeholder=" "
            className="pt-6 pb-2 peer"
            {...register("fullname")}
          />
          <Label 
            htmlFor="fullname"
            className="absolute left-3 top-4 text-muted-foreground transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
          >
            Full Name
          </Label>
          {errors.fullname && <p className="text-xs text-destructive">{errors.fullname.message}</p>}
        </div>

        <div className="space-y-2 relative">
          <Input
            id="username"
            placeholder=" "
            className="pt-6 pb-2 peer"
            {...register("username")}
          />
          <Label 
            htmlFor="username"
            className="absolute left-3 top-4 text-muted-foreground transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
          >
            Username
          </Label>
          {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
        </div>
      </div>

      <div className="space-y-2 relative">
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

      <div className="space-y-2 relative">
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
        <PasswordStrengthMeter password={password} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
      </Button>
    </form>
  );
};
