import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/authSlice";
import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";
import themeReducer from "./slices/themeSlice";
import uiReducer from "./slices/uiSlice";
import socketReducer from "./slices/socketSlice";
import loadingReducer from "./slices/loadingSlice";
import feedReducer from "@/features/feed/state/feedSlice";
import postReducer from "@/features/post/state/postSlice";
import postEditorReducer from "@/features/post-editor/state/postEditorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    notification: notificationReducer,
    theme: themeReducer,
    ui: uiReducer,
    socket: socketReducer,
    loading: loadingReducer,
    feed: feedReducer,
    post: postReducer,
    postEditor: postEditorReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
