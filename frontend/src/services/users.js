import api from "./api";

export const userService = {
  // Get all users with pagination and filters
  getAllUsers: async (params = {}) => {
    const response = await api.get("/users", { params });
    return response;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.user;
  },

  // Get user statistics
  getUserStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.stats;
  },

  // Update user
  updateUser: async (userId, updates) => {
    const response = await api.put(`/users/${userId}`, updates);
    return response.user;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response;
  },

  // Teaching skills management
  addTeachingSkill: async (userId, skillData) => {
    const response = await api.post(
      `/users/${userId}/teaching-skills`,
      skillData
    );
    return response;
  },

  removeTeachingSkill: async (userId, skillId) => {
    const response = await api.delete(
      `/users/${userId}/teaching-skills/${skillId}`
    );
    return response;
  },

  // Learning skills management
  addLearningSkill: async (userId, skillData) => {
    const response = await api.post(
      `/users/${userId}/learning-skills`,
      skillData
    );
    return response;
  },

  removeLearningSkill: async (userId, skillId) => {
    const response = await api.delete(
      `/users/${userId}/learning-skills/${skillId}`
    );
    return response;
  },
};
