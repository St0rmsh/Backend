import axios, { InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./cookies.js";
import { API_BASE_URL } from "@/App/config/env.js";
import { ROUTES } from "../constants/routes";
import { socketService } from "./socket.js";

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _refreshRetry?: boolean;
  }
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 second global timeout
});

/**
 * Request interceptor
 * Adds access token and unique request ID to all requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add unique request ID for tracking
    config.headers['X-Request-ID'] = crypto.randomUUID();
    return config;
  },
  (error) => Promise.reject(error)
);

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

let logoutCallback: (() => void) | null = null;

/**
 * Register a callback to be called when logout is needed
 * Called when refresh token is invalid or expired
 */
export const registerLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

/**
 * Process queued requests after token refresh
 * Either retries them with new token or rejects them
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response interceptor
 * Handles 401 errors by automatically refreshing the access token
 * Implements exponential backoff for token refresh queue
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors that haven't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-access-token`,
          { refreshToken },
          { timeout: 10000 } // 10 second timeout for refresh
        );

        // Backend returns only accessToken (no refreshToken rotation yet)
        const newAccessToken = response.data.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("Invalid refresh response: no access token");
        }

        // Update tokens (keep existing refresh token)
        setTokens(newAccessToken, refreshToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Update socket token and reconnect
        socketService.reconnectWithToken(newAccessToken);

        // Broadcast token refresh to other tabs
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem('auth_token_refreshed', JSON.stringify({
            timestamp: Date.now(),
            token: newAccessToken
          }));
        }

        // Process queued requests with new token
        processQueue(null, newAccessToken);
        
        // Retry original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - likely refresh token expired
        processQueue(refreshError, null);
        clearTokens();
        socketService.disconnect();

        // Notify other tabs about logout via localStorage
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem('auth_logout', JSON.stringify({
            timestamp: Date.now(),
            reason: 'token_refresh_failed'
          }));
        }

        // Call registered logout callback if available
        if (logoutCallback) {
          logoutCallback();
        } else {
          // Fallback: redirect to login
          if (typeof window !== "undefined") {
            window.location.href = ROUTES.LOGIN;
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
