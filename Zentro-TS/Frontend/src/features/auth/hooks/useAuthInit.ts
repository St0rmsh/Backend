import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { fetchCurrentUserThunk, logoutThunk } from '../state/authThunks';
import { getAccessToken, getRefreshToken } from '@/shared/lib/cookies';
import { registerLogoutCallback } from '@/shared/lib/axios';
import { socketService } from '@/shared/lib/socket';
import { setInitialCheckComplete } from '../state/authSlice';

/**
 * useAuthInit Hook
 * 
 * Initializes authentication on app startup:
 * 1. Checks for stored tokens in cookies
 * 2. Verifies tokens are still valid via GET /auth/me
 * 3. Restores Redux auth state
 * 4. Reconnects Socket.IO
 * 5. Restores theme and sidebar state
 * 
 * Registers logout callback for token refresh failures
 * Listens for auth events from other browser tabs
 * 
 * Should be called once at app root level (e.g., in AppRouter or main App component)
 */
export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const { isAuthenticated, user } = auth;
  const hasInitialized = useRef(false);

  // Register logout callback for axios
  useEffect(() => {
    registerLogoutCallback(() => {
      dispatch(logoutThunk());
    });
  }, [dispatch]);

  // Listen for authentication events from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_logout') {
        // Another tab logged out
        dispatch(logoutThunk());
      } else if (event.key === 'auth_token_refreshed') {
        // Token was refreshed in another tab
        // Optionally sync state if needed
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  // Initial auth restoration
  useEffect(() => {
    // Prevent multiple initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAuth = async () => {
      try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        // No refresh token = user is definitely not logged in
        if (!refreshToken) {
          dispatch(setInitialCheckComplete(true));
          return;
        }

        // If access token exists, verify it's still valid
        if (accessToken) {
          // Tokens exist - verify they're still valid
          // This will trigger token refresh if needed (via 401 interceptor)
          await dispatch(fetchCurrentUserThunk()).unwrap();
        } else {
          // No access token but refresh token exists
          // User was logged in but access token expired/was deleted
          // Try to verify current user (will auto-refresh via interceptor on 401)
          try {
            await dispatch(fetchCurrentUserThunk()).unwrap();
          } catch (verifyError) {
            // If verification fails, user will be logged out
            console.warn('User verification failed during init:', verifyError);
          }
        }

        // Reconnect socket with current token (will be refreshed if needed)
        const currentAccessToken = getAccessToken();
        if (currentAccessToken) {
          socketService.connect(currentAccessToken);
        }

        // Restore other app state
        restoreAppState();
      } catch (error) {
        // Token verification failed - tokens are likely expired or invalid
        console.error('Auth initialization failed:', error);
        // Logout will be triggered by axios interceptor if needed
      } finally {
        // Mark initial check as complete regardless of outcome
        dispatch(setInitialCheckComplete(true));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return { isAuthenticated, user };
};

/**
 * Restore app state from localStorage
 * Includes theme, sidebar state, etc.
 */
function restoreAppState() {
  try {
    // Restore theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Restore other state as needed
  } catch (error) {
    console.error('Failed to restore app state:', error);
  }
}
