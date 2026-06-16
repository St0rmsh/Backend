import { AxiosError } from "axios";
import { AUTH_MESSAGES } from "../constants/authMessages";
import { ApiErrorResponse } from "../types/api.types";

export const handleAuthError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    if (data && data.message) {
      return data.message;
    }
    // Handle specific status codes if needed
    if (error.response?.status === 401) {
      return "Invalid credentials or session expired.";
    }
  }
  return AUTH_MESSAGES.GENERIC_ERROR;
};
