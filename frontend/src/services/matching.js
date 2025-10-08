import api from "./api";

export const matchingService = {
  // Find tutors with filters
  findTutors: async (params = {}) => {
    const response = await api.get("/matching/tutors", { params });
    return response;
  },

  // Find learners looking for tutoring
  findLearners: async (params = {}) => {
    const response = await api.get("/matching/learners", { params });
    return response;
  },

  // Get skill-based matches
  getSkillMatches: async (skillId, params = {}) => {
    const response = await api.get("/matching/skills", {
      params: { skillId, ...params },
    });
    return response;
  },

  // Get recommended skills
  getRecommendedSkills: async () => {
    const response = await api.get("/matching/recommendations");
    return response.recommendations;
  },

  // Get matching statistics
  getMatchingStats: async () => {
    const response = await api.get("/matching/stats");
    return response.stats;
  },
};
