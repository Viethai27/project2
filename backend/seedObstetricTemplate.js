import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import MedicalFormTemplate from './models/2. CATALOGUE_FACILYTY/MedicalFormTeemplate.model.js';
import User from './models/1. AUTH_EMPLOYEE/User.model.js';

dotenv.config();

const seedObstetricTemplate = async () => {
  try {
    await connectDB();
    
    // Find admin user to create template
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('⚠️ Không tìm thấy admin user, tạo template với userId tạm');
    }

    // Delete existing obstetric template
    await MedicalFormTemplate.deleteMany({ name: /Bệnh án Sản khoa/i });
    console.log('🗑️ Đã xóa template Sản khoa cũ (nếu có)');

    const obstetricTemplate = await MedicalFormTemplate.create({
      name: "Bệnh án Sản khoa",
      description: "Biểu mẫu 05/BV-01 - Bệnh án Sản khoa theo quy định Bộ Y tế",
      schema_definition: {
        formCode: "05/BV-01",
        version: "1.0",
        sections: [
          // SECTION 1: Thông tin hành chính
          {
            id: "administrative_info",
            title: "Thông tin hành chính",
            order: 1,
            fields: [
              {
                name: "fullName",
                label: "Họ và tên",
                type: "text",
                required: true,
                placeholder: "Nhập họ tên đầy đủ",
                validation: { minLength: 2 }
              },
              {
                name: "dateOfBirth",
                label: "Ngày sinh",
                type: "date",
                required: true
              },
              {
                name: "age",
                label: "Tuổi",
                type: "number",
                required: true,
                validation: { min: 15, max: 60 }
              },
              {
                name: "occupation",
                label: "Nghề nghiệp",
                type: "text"
              },
              {
                name: "ethnicity",
                label: "Dân tộc",
                type: "text",
                defaultValue: "Kinh"
              },
              {
                name: "address",
                label: "Địa chỉ",
                type: "textarea",
                required: true,
                rows: 2
              },
              {
                name: "phoneNumber",
                label: "Số điện thoại",
                type: "tel",
                required: true,
                validation: { pattern: "^0[0-9]{9}$" }
              },
              {
                name: "healthInsuranceNumber",
                label: "Số thẻ BHYT",
                type: "text"
              }
            ]
          },

          // SECTION 2: Thông tin nhập viện
          {
            id: "admission_info",
            title: "Thông tin nhập viện",
            order: 2,
            fields: [
              {
                name: "admissionDateTime",
                label: "Ngày giờ nhập viện",
                type: "datetime-local",
                required: true
              },
              {
                name: "admissionSource",
                label: "Nguồn nhập viện",
                type: "select",
                required: true,
                options: [
                  { value: "emergency", label: "Cấp cứu" },
                  { value: "clinic", label: "Phòng khám" },
                  { value: "transfer", label: "Chuyển viện" }
                ]
              },
              {
                name: "roomNumber",
                label: "Số phòng",
                type: "text"
              },
              {
                name: "bedNumber",
                label: "Số giường",
                type: "text"
              }
            ]
          },

          // SECTION 3: Tiền sử thai sản
          {
            id: "obstetric_history",
            title: "Tiền sử thai sản",
            order: 3,
            fields: [
              {
                name: "gravida",
                label: "Số lần có thai (G)",
                type: "number",
                required: true,
                validation: { min: 1 },
                helpText: "Tổng số lần có thai bao gồm lần này"
              },
              {
                name: "para",
                label: "Số lần sinh (P)",
                type: "number",
                required: true,
                validation: { min: 0 }
              },
              {
                name: "abortus",
                label: "Số lần sẩy/nạo (A)",
                type: "number",
                defaultValue: 0,
                validation: { min: 0 }
              },
              {
                name: "livingChildren",
                label: "Số con còn sống",
                type: "number",
                defaultValue: 0,
                validation: { min: 0 }
              }
            ]
          },

          // SECTION 4: Thai kỳ hiện tại
          {
            id: "current_pregnancy",
            title: "Thai kỳ hiện tại",
            order: 4,
            fields: [
              {
                name: "lastMenstrualPeriod",
                label: "Ngày kinh cuối (LMP)",
                type: "date",
                required: true
              },
              {
                name: "expectedDeliveryDate",
                label: "Dự kiến ngày sinh (EDD)",
                type: "date",
                required: true
              },
              {
                name: "gestationalWeeks",
                label: "Tuổi thai (tuần)",
                type: "number",
                required: true,
                validation: { min: 1, max: 45 }
              },
              {
                name: "gestationalDays",
                label: "Tuổi thai (ngày)",
                type: "number",
                defaultValue: 0,
                validation: { min: 0, max: 6 }
              },
              {
                name: "prenatalVisits",
                label: "Số lần khám thai",
                type: "number",
                validation: { min: 0 }
              },
              {
                name: "ultrasoundScans",
                label: "Số lần siêu âm",
                type: "number",
                validation: { min: 0 }
              }
            ]
          },

          // SECTION 5: Khám lâm sàng
          {
            id: "clinical_examination",
            title: "Khám lâm sàng lúc nhập viện",
            order: 5,
            fields: [
              {
                name: "bloodPressure",
                label: "Huyết áp (mmHg)",
                type: "text",
                placeholder: "VD: 120/80",
                required: true
              },
              {
                name: "heartRate",
                label: "Nhịp tim (lần/phút)",
                type: "number",
                validation: { min: 40, max: 200 }
              },
              {
                name: "temperature",
                label: "Nhiệt độ (°C)",
                type: "number",
                step: 0.1,
                validation: { min: 35, max: 42 }
              },
              {
                name: "weight",
                label: "Cân nặng (kg)",
                type: "number",
                validation: { min: 30, max: 200 }
              },
              {
                name: "height",
                label: "Chiều cao (cm)",
                type: "number",
                validation: { min: 100, max: 220 }
              },
              {
                name: "fundalHeight",
                label: "Chiều cao tử cung (cm)",
                type: "number",
                validation: { min: 0, max: 50 }
              },
              {
                name: "fetalHeartRate",
                label: "Tim thai (lần/phút)",
                type: "number",
                validation: { min: 100, max: 180 }
              },
              {
                name: "fetalPresentation",
                label: "Ngôi thai",
                type: "select",
                options: [
                  { value: "cephalic", label: "Ngôi đầu" },
                  { value: "breech", label: "Ngôi ngược" },
                  { value: "transverse", label: "Ngôi ngang" }
                ]
              },
              {
                name: "cervicalDilation",
                label: "Độ mở cổ tử cung (cm)",
                type: "number",
                validation: { min: 0, max: 10 }
              },
              {
                name: "cervicalEffacement",
                label: "Độ xóa cổ tử cung (%)",
                type: "number",
                validation: { min: 0, max: 100 }
              }
            ]
          },

          // SECTION 6: Chuyển dạ và sinh
          {
            id: "labor_delivery",
            title: "Chuyển dạ và sinh",
            order: 6,
            fields: [
              {
                name: "laborOnsetTime",
                label: "Thời gian bắt đầu chuyển dạ",
                type: "datetime-local"
              },
              {
                name: "laborType",
                label: "Loại chuyển dạ",
                type: "select",
                options: [
                  { value: "spontaneous", label: "Tự nhiên" },
                  { value: "induced", label: "Gây chuyển dạ" }
                ]
              },
              {
                name: "ruptureOfMembranesTime",
                label: "Thời gian vỡ ối",
                type: "datetime-local"
              },
              {
                name: "amnioticFluidColor",
                label: "Màu nước ối",
                type: "select",
                options: [
                  { value: "clear", label: "Trong" },
                  { value: "meconium_stained", label: "Có phân su" },
                  { value: "bloody", label: "Lẫn máu" }
                ]
              },
              {
                name: "deliveryDateTime",
                label: "Ngày giờ sinh",
                type: "datetime-local",
                required: true
              },
              {
                name: "deliveryMethod",
                label: "Phương pháp sinh",
                type: "select",
                required: true,
                options: [
                  { value: "normal_vaginal", label: "Sinh thường" },
                  { value: "cesarean_section", label: "Mổ lấy thai" },
                  { value: "forceps", label: "Forceps" },
                  { value: "vacuum_extraction", label: "Hút chân không" }
                ]
              },
              {
                name: "episiotomy",
                label: "Cắt tầng sinh môn",
                type: "select",
                options: [
                  { value: "none", label: "Không" },
                  { value: "median", label: "Giữa" },
                  { value: "mediolateral", label: "Giữa bên" }
                ]
              },
              {
                name: "placentaDeliveryTime",
                label: "Thời gian sổ nhau",
                type: "datetime-local"
              },
              {
                name: "bloodLoss",
                label: "Lượng máu mất (ml)",
                type: "number",
                validation: { min: 0 }
              },
              {
                name: "deliveryComplications",
                label: "Biến chứng khi sinh",
                type: "textarea",
                rows: 3
              }
            ]
          },

          // SECTION 7: Thông tin trẻ sơ sinh
          {
            id: "newborn_info",
            title: "Thông tin trẻ sơ sinh",
            order: 7,
            type: "array",
            minItems: 1,
            maxItems: 4,
            fields: [
              {
                name: "gender",
                label: "Giới tính",
                type: "radio",
                required: true,
                options: [
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" }
                ]
              },
              {
                name: "birthWeight",
                label: "Cân nặng (gram)",
                type: "number",
                required: true,
                validation: { min: 500, max: 6000 }
              },
              {
                name: "birthLength",
                label: "Chiều dài (cm)",
                type: "number",
                validation: { min: 30, max: 70 }
              },
              {
                name: "headCircumference",
                label: "Vòng đầu (cm)",
                type: "number",
                validation: { min: 20, max: 50 }
              },
              {
                name: "apgarScore1Min",
                label: "Điểm Apgar 1 phút",
                type: "number",
                required: true,
                validation: { min: 0, max: 10 }
              },
              {
                name: "apgarScore5Min",
                label: "Điểm Apgar 5 phút",
                type: "number",
                required: true,
                validation: { min: 0, max: 10 }
              },
              {
                name: "apgarScore10Min",
                label: "Điểm Apgar 10 phút",
                type: "number",
                validation: { min: 0, max: 10 }
              },
              {
                name: "congenitalAnomalies",
                label: "Dị tật bẩm sinh",
                type: "textarea",
                rows: 2,
                placeholder: "Ghi 'Không' nếu không có"
              },
              {
                name: "newbornStatus",
                label: "Tình trạng sau sinh",
                type: "select",
                required: true,
                options: [
                  { value: "healthy", label: "Khỏe mạnh" },
                  { value: "requires_observation", label: "Cần theo dõi" },
                  { value: "requires_intensive_care", label: "Chuyển hồi sức" }
                ]
              }
            ]
          },

          // SECTION 8: Chẩn đoán
          {
            id: "diagnosis",
            title: "Chẩn đoán",
            order: 8,
            fields: [
              {
                name: "admissionDiagnosis",
                label: "Chẩn đoán lúc nhập viện",
                type: "textarea",
                required: true,
                rows: 2
              },
              {
                name: "finalDiagnosis",
                label: "Chẩn đoán ra viện",
                type: "textarea",
                required: true,
                rows: 3
              }
            ]
          },

          // SECTION 9: Điều trị
          {
            id: "treatment",
            title: "Điều trị và chăm sóc",
            order: 9,
            fields: [
              {
                name: "mainTreatment",
                label: "Phương pháp điều trị chính",
                type: "textarea",
                rows: 3
              },
              {
                name: "medications",
                label: "Thuốc sử dụng",
                type: "textarea",
                rows: 4,
                placeholder: "Liệt kê các thuốc đã sử dụng"
              },
              {
                name: "procedures",
                label: "Thủ thuật/Can thiệp",
                type: "textarea",
                rows: 3
              }
            ]
          },

          // SECTION 10: Kết quả điều trị
          {
            id: "outcome",
            title: "Kết quả điều trị",
            order: 10,
            fields: [
              {
                name: "dischargeDateTime",
                label: "Ngày giờ ra viện",
                type: "datetime-local"
              },
              {
                name: "treatmentResult",
                label: "Kết quả điều trị",
                type: "select",
                options: [
                  { value: "cured", label: "Khỏi" },
                  { value: "improved", label: "Đỡ" },
                  { value: "stable", label: "Không thay đổi" },
                  { value: "transferred", label: "Chuyển viện" }
                ]
              },
              {
                name: "motherCondition",
                label: "Tình trạng sản phụ ra viện",
                type: "textarea",
                rows: 2
              },
              {
                name: "newbornCondition",
                label: "Tình trạng trẻ sơ sinh ra viện",
                type: "textarea",
                rows: 2
              },
              {
                name: "dischargeInstructions",
                label: "Dặn dò khi ra viện",
                type: "textarea",
                rows: 4,
                placeholder: "Hướng dẫn chăm sóc, tái khám, điều trị..."
              },
              {
                name: "followUpDate",
                label: "Ngày tái khám",
                type: "date"
              }
            ]
          }
        ]
      },
      created_by: adminUser?._id || new mongoose.Types.ObjectId(),
      status: "active"
    });

    console.log('\n✅ Đã tạo template Bệnh án Sản khoa thành công!');
    console.log('📋 Template ID:', obstetricTemplate._id);
    console.log('📝 Tên:', obstetricTemplate.name);
    console.log('📄 Mã biểu mẫu:', obstetricTemplate.schema_definition.formCode);
    console.log('📊 Số sections:', obstetricTemplate.schema_definition.sections.length);
    
    // Count total fields
    const totalFields = obstetricTemplate.schema_definition.sections.reduce((sum, section) => {
      return sum + section.fields.length;
    }, 0);
    console.log('🔢 Tổng số fields:', totalFields);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

seedObstetricTemplate();
