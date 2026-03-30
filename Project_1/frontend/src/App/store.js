import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import videoReducer from "../features/Yt_Clone/ytSlice.js";

export const store = configureStore({
  reducer:{
    video: videoReducer,
    auth :authReducer,
  } 
})