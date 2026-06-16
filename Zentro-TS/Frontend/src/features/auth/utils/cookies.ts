import Cookies from "js-cookie";
import { AUTH_KEYS } from "../constants/authKeys";

const TOKEN_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(AUTH_KEYS.ACCESS_TOKEN, accessToken, TOKEN_OPTIONS);
  Cookies.set(AUTH_KEYS.REFRESH_TOKEN, refreshToken, TOKEN_OPTIONS);
};

export const getAccessToken = () => Cookies.get(AUTH_KEYS.ACCESS_TOKEN);
export const getRefreshToken = () => Cookies.get(AUTH_KEYS.REFRESH_TOKEN);

export const clearTokens = () => {
  Cookies.remove(AUTH_KEYS.ACCESS_TOKEN);
  Cookies.remove(AUTH_KEYS.REFRESH_TOKEN);
};
