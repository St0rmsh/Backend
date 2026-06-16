import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";
import { profileService } from "../services/profile.service";
import { LoginFormData } from "../schemas/login.schema";
import { RegisterFormData } from "../schemas/register.schema";
import { ProfileFormData } from "../schemas/profile.schema";
import { handleAuthError } from "../utils/authErrorHandler";
import { setTokens, clearTokens } from "../utils/cookies";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchCurrentUserThunk = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      clearTokens();
      return true;
    } catch (error) {
      // Even if API fails, clear local tokens
      clearTokens();
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (
    payload: { data: ProfileFormData; avatarFile?: File; bannerFile?: File },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileService.updateProfile(
        payload.data,
        payload.avatarFile,
        payload.bannerFile
      );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);
