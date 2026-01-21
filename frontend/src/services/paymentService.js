import api from './api';

export const paymentService = {
  // Get bill by ID or patient ID
  getBill: async (searchTerm) => {
    try {
      const response = await api.get('/payment/bill', {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không tìm thấy hóa đơn');
    }
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/payment/process', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Thanh toán thất bại');
    }
  },

  // Get payment history
  getPaymentHistory: async (patientId) => {
    try {
      const response = await api.get(`/payment/history/${patientId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải lịch sử thanh toán');
    }
  },

  // Create invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post('/payment/invoice', invoiceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo hóa đơn');
    }
  },
};

export default paymentService;
