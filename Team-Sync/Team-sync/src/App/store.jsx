import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../features/auth/state/auth/authSlice"
import themeReducer from "../shared/state/ThemeSlice"

const store = configureStore({
    
    reducer: {
        auth:authReducer,
        theme:themeReducer
    }
});


export default store;
