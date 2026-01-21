import api from './api';

export const patientService = {
  // Search patient
  searchPatient: async (searchTerm) => {
    try {
      const response = await api.get('/patients/search', {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Tìm kiếm thất bại');
    }
  },

  // Create new patient
  createPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo hồ sơ bệnh nhân');
    }
  },

  // Get patient by ID
  getPatientById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải thông tin bệnh nhân');
    }
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    try {
      const response = await api.put(`/patients/${id}`, patientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật thông tin thất bại');
    }
  },

  // Get all patients (for receptionist/doctor)
  getAllPatients: async (filters) => {
    try {
      const response = await api.get('/patients', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách bệnh nhân');
    }
  },
};

export default patientService;
