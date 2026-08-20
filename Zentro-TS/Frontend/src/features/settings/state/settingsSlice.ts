import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState, Theme, Language, SettingsPreferences } from "../types";

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme") as Theme;
  return savedTheme || "system";
};

const getInitialPreferences = (): SettingsPreferences => {
  const savedPrefs = localStorage.getItem("preferences");
  if (savedPrefs) {
    try {
      return JSON.parse(savedPrefs);
    } catch (e) {
      // Ignore
    }
  }
  return {
    reducedMotion: false,
    compactMode: false,
    autoPlayMedia: true,
  };
};

const initialState: SettingsState = {
  theme: getInitialTheme(),
  language: (localStorage.getItem("language") as Language) || "en",
  preferences: getInitialPreferences(),
  loading: false,
  error: null,
  successMessage: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
      
      // Update DOM for theme
      if (action.payload === "dark" || (action.payload === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    updatePreferences: (state, action: PayloadAction<Partial<SettingsPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
      localStorage.setItem("preferences", JSON.stringify(state.preferences));
    },
    clearSettingsMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
});

export const { setTheme, setLanguage, updatePreferences, clearSettingsMessages } = settingsSlice.actions;
export default settingsSlice.reducer;
