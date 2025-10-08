import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  refreshToken: () => api.post("/auth/refresh"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),
  updateProfile: (profileData) => api.put("/auth/profile", profileData),
  changePassword: (passwordData) =>
    api.put("/auth/change-password", passwordData),
};

// User API
export const userAPI = {
  getUsers: (params) => api.get("/users", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get("/users/stats"),
};

// Skills API
export const skillsAPI = {
  getSkills: (params) => api.get("/skills", { params }),
  getSkillById: (id) => api.get(`/skills/${id}`),
  createSkill: (skillData) => api.post("/skills", skillData),
  updateSkill: (id, skillData) => api.put(`/skills/${id}`, skillData),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
  getSkillCategories: () => api.get("/skills/categories"),
};

// Sessions API
export const sessionsAPI = {
  getSessions: (params) => api.get("/sessions", { params }),
  getSessionById: (id) => api.get(`/sessions/${id}`),
  createSession: (sessionData) => api.post("/sessions", sessionData),
  updateSession: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  joinSession: (id) => api.post(`/sessions/${id}/join`),
  leaveSession: (id) => api.post(`/sessions/${id}/leave`),
  completeSession: (id) => api.post(`/sessions/${id}/complete`),
  rateSession: (id, rating) => api.post(`/sessions/${id}/rate`, { rating }),
};

// Matching API
export const matchingAPI = {
  findMatches: (preferences) => api.post("/matching/find", preferences),
  getMatchHistory: () => api.get("/matching/history"),
  updatePreferences: (preferences) =>
    api.put("/matching/preferences", preferences),
  getRecommendations: () => api.get("/matching/recommendations"),
};

// Payments API
export const paymentsAPI = {
  getPayments: (params) => api.get("/payments", { params }),
  createPayment: (paymentData) => api.post("/payments", paymentData),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  processRefund: (id, amount) => api.post(`/payments/${id}/refund`, { amount }),
  getPaymentStats: () => api.get("/payments/stats"),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get("/notifications", { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get("/notifications/unread-count"),
};

export default api;
