import api from "./api";

export const analyticsService = {
  // Get comprehensive user analytics
  getUserAnalytics: async (params = {}) => {
    const response = await api.get("/users/analytics", { params });
    return response.analytics;
  },

  // Get teaching analytics (for tutors)
  getTeachingAnalytics: async (params = {}) => {
    const response = await api.get("/analytics/teaching", { params });
    return response.analytics;
  },

  // Get learning analytics (for learners)
  getLearningAnalytics: async (params = {}) => {
    const response = await api.get("/analytics/learning", { params });
    return response.analytics;
  },

  // Get analytics overview (auto-detects role)
  getAnalyticsOverview: async (params = {}) => {
    const response = await api.get("/analytics/overview", { params });
    return response.analytics;
  },

  // Get analytics history
  getAnalyticsHistory: async (params = {}) => {
    const response = await api.get("/analytics/history", { params });
    return response.history;
  },

  // Get assessment analytics
  getAssessmentAnalytics: async (params = {}) => {
    const response = await api.get("/analytics/assessments", { params });
    return response.assessmentAnalytics;
  },

  // Generate report
  generateReport: async (data) => {
    const response = await api.post("/analytics/reports", data);
    return response.report;
  },

  // Get reports
  getReports: async (params = {}) => {
    const response = await api.get("/analytics/reports", { params });
    return response.reports;
  },

  // Get report by ID
  getReportById: async (reportId) => {
    const response = await api.get(`/analytics/reports/${reportId}`);
    return response.report;
  },

  // Get leaderboard with peer comparison
  getLeaderboard: async (params = {}) => {
    const response = await api.get("/analytics/leaderboard", { params });
    return response.leaderboard;
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

  // Get engagement heatmap (Activity Heatmap: Day vs. Time)
  getEngagementHeatmap: async (params = {}) => {
    const response = await api.get("/analytics/teaching/engagement-heatmap", {
      params,
    });
    return response;
  },

  // Get score distribution histogram
  getScoreDistribution: async (params = {}) => {
    const response = await api.get("/analytics/teaching/score-distribution", {
      params,
    });
    return response;
  },

  // Get calendar heatmap (Attendance & Assignments)
  getCalendarHeatmap: async (params = {}) => {
    const response = await api.get("/analytics/teaching/calendar-heatmap", {
      params,
    });
    return response;
  },
};
