import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  sidebarOpen: true,
  notifications: [],
  activeModal: null,
  loading: {},
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      state.loading[key] = isLoading;
    },
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setActiveModal,
  closeModal,
  setLoading,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectNotifications = (state) => state.ui.notifications;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectLoading = (state) => state.ui.loading;
export const selectToasts = (state) => state.ui.toasts;
