import api from "./api";

export const paymentService = {
  // Get all payments for current user
  getAllPayments: async (params = {}) => {
    const response = await api.get("/payments", { params });
    return response;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get("/payments/methods");
    return response.data.paymentMethods;
  },

  // Get payment statistics
  getPaymentStats: async () => {
    const response = await api.get("/payments/stats");
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data.payment;
  },

  // Create payment
  createPayment: async (paymentData) => {
    const response = await api.post("/payments", paymentData);
    return response.data.payment;
  },

  // Request refund
  requestRefund: async (paymentId, reason) => {
    const response = await api.post(`/payments/${paymentId}/refund`, {
      reason,
    });
    return response.data;
  },
};
