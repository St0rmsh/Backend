import { axiosInstance } from "@/shared/lib/axios";
import { LoginFormData } from "../schemas/login.schema";
import { RegisterFormData } from "../schemas/register.schema";
import { ForgotPasswordFormData } from "../schemas/forgotPassword.schema";
import { ResetPasswordFormData } from "../schemas/resetPassword.schema";
import { ChangePasswordFormData } from "../schemas/changePassword.schema";
import { LoginResponse, RegisterResponse } from "../types/auth.types";
import { ApiResponse } from "@/shared/types/api.types";
import { User } from "@/shared/types/user.types";

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterFormData) => {
    const response = await axiosInstance.post<ApiResponse<RegisterResponse>>("/auth/register", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post<ApiResponse>("/auth/logout");
    return response.data;
  },

  sendOtp: async () => {
    const response = await axiosInstance.post<ApiResponse>("/auth/send-otp");
    return response.data;
  },

  verifyOtp: async (otp: string) => {
    const response = await axiosInstance.post<ApiResponse>("/auth/verify-otp", { otp });
    return response.data;
  },

  changePassword: async (data: ChangePasswordFormData) => {
    const response = await axiosInstance.patch<ApiResponse>("/auth/change-password", data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordFormData) => {
    const response = await axiosInstance.post<ApiResponse>("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordFormData) => {
    const response = await axiosInstance.post<ApiResponse>("/auth/reset-password", data);
    return response.data;
  },
};
