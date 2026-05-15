import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isMobileMenuOpen: boolean;
  isGlobalLoading: boolean;
  theme: 'light' | 'dark' | 'system';
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isGlobalLoading: false,
  theme: 'system',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isGlobalLoading = action.payload;
    },
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  setGlobalLoading,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;