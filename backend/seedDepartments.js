import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/2. CATALOGUE_FACILYTY/Department.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';

dotenv.config();

const departments = [
    { name: "Nội khoa" },
    { name: "Ngoại khoa" },
    { name: "Sản khoa" },
    { name: "Nhi khoa" },
    { name: "Tim mạch" },
    { name: "Thần kinh" },
    { name: "Tai Mũi Họng" },
    { name: "Mắt" },
    { name: "Da liễu" },
    { name: "Răng Hàm Mặt" },
    { name: "Chấn thương chỉnh hình" },
    { name: "Hồi sức cấp cứu" }
];

const doctorSpecialties = [
    { email: "nhung.nguyen@pamec.com", specialty: "Nội khoa", specialization: "Nội tiết - Đái tháo đường" },
    { email: "chau.tran@pamec.com", specialty: "Ngoại khoa", specialization: "Ngoại tổng quát" },
    { email: "mai.hoang@pamec.com", specialty: "Tim mạch", specialization: "Tim mạch can thiệp" },
    { email: "linh.pham@pamec.com", specialty: "Sản khoa", specialization: "Sản khoa" },
    { email: "tuan.le@pamec.com", specialty: "Nhi khoa", specialization: "Nhi tổng quát" }
];

async function seedDepartments() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing departments
        await Department.deleteMany({});
        console.log('Cleared existing departments');

        // Insert departments
        const createdDepartments = await Department.insertMany(departments);
        console.log(`Created ${createdDepartments.length} departments:`);
        createdDepartments.forEach(dept => {
            console.log(`  - ${dept.name}`);
        });

        // Update doctors with specialties
        console.log('\nUpdating doctors with specialties...');
        for (const docSpec of doctorSpecialties) {
            const updated = await Doctor.findOneAndUpdate(
                { email: docSpec.email },
                {
                    specialty: docSpec.specialty,
                    specialization: docSpec.specialization
                },
                { new: true }
            );
            if (updated) {
                console.log(`  ✓ ${updated.full_name} - ${docSpec.specialty} (${docSpec.specialization})`);
            } else {
                console.log(`  ✗ Doctor not found: ${docSpec.email}`);
            }
        }

        console.log('\n✅ Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedDepartments();
