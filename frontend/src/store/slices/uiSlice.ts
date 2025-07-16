import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { UIState } from '../../types/store';

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'system',
  language: 'en',
  notifications: {
    show: false,
    message: '',
    type: 'info',
  },
  modals: {},
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type?: 'success' | 'error' | 'warning' | 'info' }>
    ) => {
      state.notifications = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideNotification: (state) => {
      state.notifications.show = false;
    },
    setModalOpen: (state, action: PayloadAction<{ modal: string; open: boolean }>) => {
      state.modals[action.payload.modal] = action.payload.open;
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  setLanguage,
  showNotification,
  hideNotification,
  setModalOpen,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
