import { RootState } from "../../../store";

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthAccessToken = (state: RootState) => state.auth.accessToken;
