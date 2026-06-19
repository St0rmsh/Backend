import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./authInitialState";
import {
  loginThunk,
  registerThunk,
  fetchCurrentUserThunk,
  logoutThunk,
  updateProfileThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  changePasswordThunk,
  sendOtpThunk,
  verifyOtpThunk
} from "./authThunks";
import { User } from "@/shared/types/user.types";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialState,
    initialCheckComplete: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    resetAuth: (state) => {
      Object.assign(state, {
        ...initialState,
        initialCheckComplete: true, // Keep it true once checked
      });
    },
    setInitialCheckComplete: (state, action: PayloadAction<boolean>) => {
      state.initialCheckComplete = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Current User
    builder.addCase(fetchCurrentUserThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initialCheckComplete = true;
    });
    builder.addCase(fetchCurrentUserThunk.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.initialCheckComplete = true;
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Update Profile
    builder.addCase(updateProfileThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(updateProfileThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Other actions only handle loading/error states
    const genericThunks = [
      forgotPasswordThunk,
      resetPasswordThunk,
      changePasswordThunk,
      sendOtpThunk,
    ];

    genericThunks.forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(thunk.fulfilled, (state) => {
        state.loading = false;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    });

    // Verify OTP updates user
    builder.addCase(verifyOtpThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtpThunk.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.user = action.payload as User;
      } else if (state.user) {
        state.user.isEmailVerified = true;
      }
    });
    builder.addCase(verifyOtpThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setAuthenticated, resetAuth, setInitialCheckComplete } = authSlice.actions;
export default authSlice.reducer;
