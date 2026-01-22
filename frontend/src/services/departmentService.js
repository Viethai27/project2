import api from './api';

/**
 * Department and Doctor Service
 * Handles API calls related to departments and doctors
 */

/**
 * Get all departments
 * @returns {Promise} List of departments
 */
export const getAllDepartments = async () => {
    try {
        const response = await api.get('/departments');
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error.response?.data || { message: 'Lỗi khi lấy danh sách chuyên khoa' };
    }
};

/**
 * Get all active doctors
 * @returns {Promise} List of doctors
 */
export const getAllDoctors = async () => {
    try {
        const response = await api.get('/doctors');
        return response.data;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error.response?.data || { message: 'Lỗi khi lấy danh sách bác sĩ' };
    }
};

/**
 * Get doctors by specialty
 * @param {string} specialty - Specialty name
 * @returns {Promise} List of doctors in that specialty
 */
export const getDoctorsBySpecialty = async (specialty) => {
    try {
        const response = await api.get(`/doctors/specialty/${specialty}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching doctors by specialty:', error);
        throw error.response?.data || { message: 'Lỗi khi lấy danh sách bác sĩ theo chuyên khoa' };
    }
};

/**
 * Get doctor by ID
 * @param {string} id - Doctor ID
 * @returns {Promise} Doctor details
 */
export const getDoctorById = async (id) => {
    try {
        const response = await api.get(`/doctors/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching doctor:', error);
        throw error.response?.data || { message: 'Lỗi khi lấy thông tin bác sĩ' };
    }
};

export default {
    getAllDepartments,
    getAllDoctors,
    getDoctorsBySpecialty,
    getDoctorById
};
