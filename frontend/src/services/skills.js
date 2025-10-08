import api from "./api";

export const skillService = {
  // Get all skills with pagination
  getAllSkills: async (params = {}) => {
    const response = await api.get("/skills", { params });
    return response;
  },

  // Search skills
  searchSkills: async (query, filters = {}) => {
    const response = await api.get("/skills/search", {
      params: { q: query, ...filters },
    });
    return response;
  },

  // Get skill categories
  getCategories: async () => {
    const response = await api.get("/skills/categories");
    return response.categories;
  },

  // Get skills by category
  getSkillsByCategory: async (category) => {
    const response = await api.get(`/skills/categories/${category}`);
    return response.skills;
  },

  // Get popular skills
  getPopularSkills: async () => {
    const response = await api.get("/skills/popular");
    return response.skills;
  },

  // Get trending skills
  getTrendingSkills: async () => {
    const response = await api.get("/skills/trending");
    return response.skills;
  },

  // Get skill statistics
  getSkillStatistics: async () => {
    const response = await api.get("/skills/statistics");
    return response.statistics;
  },

  // Get skill by ID
  getSkillById: async (skillId) => {
    const response = await api.get(`/skills/${skillId}`);
    return response.skill;
  },

  // Get skill prerequisites
  getSkillPrerequisites: async (skillId) => {
    const response = await api.get(`/skills/${skillId}/prerequisites`);
    return response.prerequisites;
  },

  // Get skill learning path
  getSkillPath: async (skillId) => {
    const response = await api.get(`/skills/${skillId}/path`);
    return response.path;
  },

  // Admin only - Create skill
  createSkill: async (skillData) => {
    const response = await api.post("/skills", skillData);
    return response.skill;
  },

  // Admin only - Update skill
  updateSkill: async (skillId, updates) => {
    const response = await api.put(`/skills/${skillId}`, updates);
    return response.skill;
  },

  // Admin only - Delete skill
  deleteSkill: async (skillId) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response;
  },
};
