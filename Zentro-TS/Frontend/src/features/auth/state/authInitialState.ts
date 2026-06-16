import { AuthState } from "../types/auth.types";
import { getAccessToken } from "../utils/cookies";

export const initialState: AuthState = {
  user: null,
  accessToken: getAccessToken() || null,
  isAuthenticated: !!getAccessToken(),
  loading: false,
  error: null,
};
