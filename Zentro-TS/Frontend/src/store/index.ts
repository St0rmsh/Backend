import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/authSlice";
import uiReducer from "./slices/uiSlice";
import socketReducer from "./slices/socketSlice";
import loadingReducer from "./slices/loadingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    socket: socketReducer,
    loading: loadingReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
