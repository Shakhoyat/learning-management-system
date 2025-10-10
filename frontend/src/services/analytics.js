import api from "./api";

export const analyticsService = {
  // Get comprehensive user analytics
  getUserAnalytics: async (params = {}) => {
    const response = await api.get("/users/analytics", { params });
    return response.analytics;
  },

  // Get learning progress
  getLearningProgress: async () => {
    const response = await api.get("/users/me/progress");
    return response.progress;
  },

  // Get user achievements
  getAchievements: async () => {
    const response = await api.get("/users/me/achievements");
    return response.achievements;
  },

  // Get session statistics
  getSessionStats: async () => {
    const response = await api.get("/sessions/stats");
    return response.stats;
  },

  // Get payment analytics
  getPaymentAnalytics: async (params = {}) => {
    const response = await api.get("/payments/analytics", { params });
    return response.analytics;
  },

  // Get skill statistics
  getSkillStats: async (skillId) => {
    const response = await api.get(`/skills/${skillId}/stats`);
    return response.stats;
  },
};
