import api from './api';

// Constants
const ENDPOINTS = {
  BASE: '/appointments',
  MY_APPOINTMENTS: '/appointments/my-appointments',
  AVAILABLE_SLOTS: '/appointments/available-slots',
  CANCEL: (id) => `/appointments/${id}/cancel`,
  BY_ID: (id) => `/appointments/${id}`,
};

const ERROR_MESSAGES = {
  CREATE: 'Đặt lịch thất bại',
  FETCH_LIST: 'Không thể tải danh sách lịch hẹn',
  FETCH_DETAIL: 'Không thể tải thông tin lịch hẹn',
  CANCEL: 'Không thể hủy lịch hẹn',
  FETCH_SLOTS: 'Không thể tải lịch trống',
  UPDATE: 'Không thể cập nhật lịch hẹn',
};

/**
 * Handle API errors consistently
 * @param {Error} error - The error object from API call
 * @param {string} defaultMessage - Default error message
 * @returns {never} - Throws an error
 */
const handleError = (error, defaultMessage) => {
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

/**
 * Validate appointment data
 * @param {Object} data - Appointment data to validate
 * @throws {Error} - If validation fails
 */
const validateAppointmentData = (data) => {
  if (!data) {
    throw new Error('Dữ liệu lịch hẹn không hợp lệ');
  }
  if (!data.doctorId) {
    throw new Error('Vui lòng chọn bác sĩ');
  }
  if (!data.appointmentDate) {
    throw new Error('Vui lòng chọn ngày hẹn');
  }
  if (!data.timeSlot) {
    throw new Error('Vui lòng chọn giờ hẹn');
  }
};

/**
 * Appointment Service
 * Handles all appointment-related API operations
 */
export const appointmentService = {
  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment details
   * @returns {Promise<Object>} Created appointment data
   */
  createAppointment: async (appointmentData) => {
    try {
      validateAppointmentData(appointmentData);
      const response = await api.post(ENDPOINTS.BASE, appointmentData);
      return response.data;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.CREATE);
    }
  },

  /**
   * Get all appointments for the current user
   * @param {Object} params - Query parameters (status, date, etc.)
   * @returns {Promise<Array>} List of appointments
   */
  getMyAppointments: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.MY_APPOINTMENTS, { params });
      return response.data;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.FETCH_LIST);
    }
  },

  /**
   * Get appointment details by ID
   * @param {string|number} id - Appointment ID
   * @returns {Promise<Object>} Appointment details
   */
  getAppointmentById: async (id) => {
    try {
      if (!id) {
        throw new Error('ID lịch hẹn không hợp lệ');
      }
      const response = await api.get(ENDPOINTS.BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.FETCH_DETAIL);
    }
  },

  /**
   * Update appointment details
   * @param {string|number} id - Appointment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated appointment
   */
  updateAppointment: async (id, updateData) => {
    try {
      if (!id) {
        throw new Error('ID lịch hẹn không hợp lệ');
      }
      const response = await api.put(ENDPOINTS.BY_ID(id), updateData);
      return response.data;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.UPDATE);
    }
  },

  /**
   * Cancel an appointment
   * @param {string|number} id - Appointment ID
   * @param {string} reason - Cancellation reason (optional)
   * @returns {Promise<Object>} Cancelled appointment data
   */
  cancelAppointment: async (id, reason = '') => {
    try {
      if (!id) {
        throw new Error('ID lịch hẹn không hợp lệ');
      }
      const response = await api.put(ENDPOINTS.CANCEL(id), { reason });
      return response.data;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.CANCEL);
    }
  },

  /**
   * Get available time slots for a doctor on a specific date
   * @param {string|number} doctorId - Doctor ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} List of available time slots
   */
  getAvailableSlots: async (doctorId, date) => {
    try {
      if (!doctorId) {
        throw new Error('Vui lòng chọn bác sĩ');
      }
      if (!date) {
        throw new Error('Vui lòng chọn ngày');
      }
      const response = await api.get(ENDPOINTS.AVAILABLE_SLOTS, {
        params: { doctorId, date }
      });
      return response.data;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.FETCH_SLOTS);
    }
  },
};

export default appointmentService;
