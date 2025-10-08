import api from "./api";

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.user;
  },

  // Update user profile
  updateProfile: async (updates) => {
    const response = await api.put("/auth/profile", updates);
    return response.user;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put("/auth/change-password", passwordData);
    return response;
  },

  // Logout
  logout: async (refreshToken) => {
    const response = await api.post("/auth/logout", refreshToken);
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post("/auth/reset-password", resetData);
    return response;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post("/auth/verify-email", { token });
    return response;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post("/auth/refresh", { refreshToken });
    return response;
  },
};
