import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/authSlice";
import userReducer from "./slices/userSlice";
import notificationReducer from "@/features/notification/state/notificationSlice";
import themeReducer from "./slices/themeSlice";
import uiReducer from "./slices/uiSlice";
import socketReducer from "./slices/socketSlice";
import loadingReducer from "./slices/loadingSlice";
import feedReducer from "@/features/feed/state/feedSlice";
import commentReducer from "../features/comments/state/commentSlice";
import postReducer from "@/features/post/state/postSlice";
import postEditorReducer from "@/features/post-editor/state/postEditorSlice";

import likeReducer from "@/features/likes/state/likeSlice";
import bookmarkReducer from "@/features/bookmarks/state/bookmarkSlice";
import followReducer from "@/features/follow/state/followSlice";

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
    comments: commentReducer,
    post: postReducer,
    postEditor: postEditorReducer,
    likes: likeReducer,
    bookmarks: bookmarkReducer,
    follow: followReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
