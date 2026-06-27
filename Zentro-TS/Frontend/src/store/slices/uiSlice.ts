import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  activeModal: string | null;
}

const initialState: UiState = {
  theme: 'dark',
  sidebarOpen: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setActiveModal(state, action: PayloadAction<string | null>) {
      state.activeModal = action.payload;
    },
  },
});

export const { setTheme, toggleSidebar, setSidebarOpen, setActiveModal } = uiSlice.actions;
export default uiSlice.reducer;
