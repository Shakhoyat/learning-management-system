import api from "./api";

export const sessionService = {
  // Get all sessions with filters
  getAllSessions: async (params = {}) => {
    const response = await api.get("/sessions", { params });
    return response;
  },

  // Get upcoming sessions
  getUpcomingSessions: async () => {
    const response = await api.get("/sessions/upcoming");
    return response.data?.sessions || response.sessions || [];
  },

  // Get session statistics
  getSessionStats: async () => {
    const response = await api.get("/sessions/stats");
    return response.stats;
  },

  // Get session by ID
  getSessionById: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.session;
  },

  // Create new session
  createSession: async (sessionData) => {
    const response = await api.post("/sessions", sessionData);
    return response.session;
  },

  // Update session
  updateSession: async (sessionId, updates) => {
    const response = await api.put(`/sessions/${sessionId}`, updates);
    return response.session;
  },

  // Cancel session
  cancelSession: async (sessionId, reason) => {
    const response = await api.delete(`/sessions/${sessionId}`, {
      data: { reason },
    });
    return response;
  },

  // Start session
  startSession: async (sessionId) => {
    const response = await api.post(`/sessions/${sessionId}/start`);
    return response;
  },

  // Complete session
  completeSession: async (sessionId, completionData) => {
    const response = await api.post(
      `/sessions/${sessionId}/complete`,
      completionData
    );
    return response;
  },

  // Add session feedback
  addFeedback: async (sessionId, feedback) => {
    const response = await api.post(
      `/sessions/${sessionId}/feedback`,
      feedback
    );
    return response;
  },
};
