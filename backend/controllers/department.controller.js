import Department from '../models/2. CATALOGUE_FACILYTY/Department.model.js';
import Doctor from '../models/1. AUTH/Doctor.model.js';

/**
 * Get all departments
 */
export const getAllDepartments = async (req, res) => {
    console.log('getAllDepartments called');
    try {
        console.log('Fetching departments from DB...');
        const departments = await Department.find({}).sort({ name: 1 });
        console.log('Found departments:', departments.length);
        
        res.json({
            success: true,
            data: departments
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chuyên khoa'
        });
    }
};

/**
 * Get all active doctors
 */
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'active' })
            .select('full_name specialty specialization email phone experience_years education avatar')
            .sort({ full_name: 1 });
        
        res.json({
            success: true,
            data: doctors
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách bác sĩ'
        });
    }
};

/**
 * Get doctors by specialty/department
 */
export const getDoctorsBySpecialty = async (req, res) => {
    try {
        const { specialty } = req.params;
        
        const doctors = await Doctor.find({ 
            specialty: specialty,
            status: 'active' 
        })
        .select('full_name specialty specialization email phone experience_years education avatar')
        .sort({ full_name: 1 });
        
        res.json({
            success: true,
            data: doctors
        });
    } catch (error) {
        console.error('Error fetching doctors by specialty:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách bác sĩ theo chuyên khoa'
        });
    }
};

/**
 * Get doctor by ID
 */
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const doctor = await Doctor.findById(id)
            .select('full_name specialty specialization email phone experience_years education avatar description');
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bác sĩ'
            });
        }
        
        res.json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin bác sĩ'
        });
    }
};
