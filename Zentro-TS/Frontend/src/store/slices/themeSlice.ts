import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

export interface ThemeState {
  mode: Theme;
  systemPreference: "light" | "dark";
}

const initialState: ThemeState = {
  mode: (localStorage.getItem("theme") as Theme) || "system",
  systemPreference: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);

      // Apply theme to document
      const root = document.documentElement;
      if (action.payload === "system") {
        const isDark = state.systemPreference === "dark";
        root.classList.toggle("dark", isDark);
      } else {
        root.classList.toggle("dark", action.payload === "dark");
      }
    },

    setSystemPreference: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemPreference = action.payload;

      // If in system mode, apply the new preference
      if (state.mode === "system") {
        document.documentElement.classList.toggle("dark", action.payload === "dark");
      }
    },

    toggleTheme: (state) => {
      if (state.mode === "system") {
        const newMode = state.systemPreference === "dark" ? "light" : "dark";
        state.mode = newMode;
        localStorage.setItem("theme", newMode);
        document.documentElement.classList.toggle("dark", newMode === "dark");
      } else {
        const newMode = state.mode === "dark" ? "light" : "dark";
        state.mode = newMode;
        localStorage.setItem("theme", newMode);
        document.documentElement.classList.toggle("dark", newMode === "dark");
      }
    },
  },
});

export const { setTheme, setSystemPreference, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
