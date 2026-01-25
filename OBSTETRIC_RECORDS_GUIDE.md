# Hướng dẫn sử dụng Hệ thống Bệnh án Sản khoa

## Tổng quan

Hệ thống Bệnh án Sản khoa được xây dựng theo mẫu **05/BV-01** của Bộ Y tế Việt Nam, sử dụng kiến trúc **Dynamic Form Template** cho phép linh hoạt trong việc quản lý và mở rộng.

## Tính năng

### 1. **Quản lý Template (Backend)**
- Template được lưu trong database dưới dạng JSON Schema
- Dễ dàng thêm/sửa/xóa fields mà không cần thay đổi code
- Hỗ trợ nhiều loại trường: text, number, date, select, radio, textarea
- Validation rules được định nghĩa trong schema

### 2. **Tạo Bệnh án Mới**
**Đường dẫn**: `/doctor/obstetric-records/new`

**Các bước**:
1. Đăng nhập với tài khoản bác sĩ
2. Vào menu "Bệnh án Sản khoa"
3. Click "Tạo bệnh án mới"
4. Chọn bệnh nhân từ dropdown
5. Điền thông tin vào 10 sections:
   - **Section 1**: Thông tin hành chính (tên, ngày sinh, CMND, địa chỉ...)
   - **Section 2**: Thông tin nhập viện (lý do, khoa, bác sĩ...)
   - **Section 3**: Tiền sử sản khoa (G/P/A, số con sống)
   - **Section 4**: Thai kỳ hiện tại (ngày kinh cuối, dự sinh, tuổi thai...)
   - **Section 5**: Khám lâm sàng (huyết áp, mạch, nhiệt độ, tim thai...)
   - **Section 6**: Chuyển dạ và sinh (thời gian, phương thức, máu mất...)
   - **Section 7**: Thông tin trẻ sơ sinh (giới tính, cân nặng, Apgar...)
   - **Section 8**: Chẩn đoán (nhập viện, ra viện)
   - **Section 9**: Điều trị (phương pháp, thuốc, thủ thuật)
   - **Section 10**: Kết quả điều trị (xuất viện, tái khám)
6. Click "Tạo bệnh án"

**Tính năng đặc biệt**:
- Hỗ trợ **đa thai**: Section "Thông tin trẻ sơ sinh" là array, có thể thêm nhiều trẻ
- **Auto-fill**: Một số trường tự động điền từ thông tin bệnh nhân
- **Validation**: Kiểm tra trường bắt buộc trước khi lưu

### 3. **Xem Danh sách Bệnh án**
**Đường dẫn**: `/doctor/obstetric-records`

**Tính năng**:
- Hiển thị tất cả bệnh án do bác sĩ tạo
- **Tìm kiếm**: Theo tên bệnh nhân, số điện thoại
- **Sắp xếp**: Mới nhất trước
- **Actions**: Xem chi tiết, Chỉnh sửa
- Hiển thị: Tên BN, SĐT, ngày sinh, ngày nhập viện, chẩn đoán

### 4. **Xem Chi tiết Bệnh án**
**Đường dẫn**: `/doctor/obstetric-records/:id`

**Tính năng**:
- Hiển thị đầy đủ thông tin bệnh án ở chế độ **Read-Only**
- **In bệnh án**: Click nút "In bệnh án" để in PDF
- **Chỉnh sửa**: Click "Chỉnh sửa" để cập nhật
- Hiển thị thông tin:
  - Header: Tên bệnh án, mã biểu mẫu
  - Thông tin bệnh nhân
  - 10 sections đầy đủ
  - Footer: Chữ ký người nhà và bác sĩ

### 5. **Cập nhật Bệnh án**
**Đường dẫn**: `/doctor/obstetric-records/:id/edit`

**Tính năng**:
- Load dữ liệu bệnh án hiện tại
- Cho phép chỉnh sửa tất cả các trường
- Validation tương tự khi tạo mới
- Lưu lịch sử chỉnh sửa (filled_at được cập nhật)

---

## Kiến trúc Hệ thống

### Backend

**Models**:
- `MedicalFormTemplate`: Lưu trữ template form (JSON Schema)
- `MedicalFormData`: Lưu trữ dữ liệu form thực tế
- `MedicalRecord`: Bệnh án tổng quát
- `Doctor`: Thông tin bác sĩ
- `Patient`: Thông tin bệnh nhân

**Controllers** ([medicalForm.controller.js](backend/controllers/medicalForm.controller.js)):
- `getObstetricTemplate`: Lấy template
- `createObstetricRecord`: Tạo bệnh án mới
- `getPatientObstetricRecords`: Lấy bệnh án của bệnh nhân
- `getObstetricRecordById`: Lấy bệnh án theo ID
- `updateObstetricRecord`: Cập nhật bệnh án
- `getMyObstetricRecords`: Lấy bệnh án của bác sĩ

**Routes** ([medicalForm.routes.js](backend/routes/medicalForm.routes.js)):
```
GET    /api/medical-forms/templates/obstetric
POST   /api/medical-forms/obstetric
GET    /api/medical-forms/obstetric/:id
GET    /api/medical-forms/obstetric/patient/:patientId
GET    /api/medical-forms/obstetric/my-records
PUT    /api/medical-forms/obstetric/:id
```

### Frontend

**Services** ([medicalFormService.js](frontend/src/services/medicalFormService.js)):
- Wrapper cho API calls
- Xử lý errors
- Return promises

**Components**:
- `DynamicFormRenderer`: Component render form động từ schema
  - Hỗ trợ: text, number, date, select, radio, textarea
  - Hỗ trợ array sections (cho đa thai)
  - Read-only mode
  - Validation

**Pages**:
- `ObstetricRecordList`: Danh sách bệnh án
- `ObstetricRecordForm`: Tạo/sửa bệnh án
- `ObstetricRecordDetail`: Xem chi tiết

---

## Cấu trúc Dữ liệu

### Template Schema

```json
{
  "name": "Bệnh án Sản khoa",
  "formCode": "05/BV-01",
  "schema_definition": {
    "sections": [
      {
        "section_id": 1,
        "section_name": "administrative_info",
        "section_label": "Thông tin hành chính",
        "is_array": false,
        "fields": [
          {
            "field_name": "patient_name",
            "label": "Họ và tên",
            "type": "text",
            "required": true,
            "validation": {
              "pattern": "^[\\p{L}\\s]+$"
            }
          }
        ]
      }
    ]
  }
}
```

### Form Data

```json
{
  "patient_name": "Nguyễn Thị Lan",
  "patient_dob": "1990-05-15",
  "gravida": 2,
  "para": 1,
  "newborns": [
    {
      "baby_order": 1,
      "gender": "female",
      "birth_weight": 3400,
      "apgar_1min": 9,
      "apgar_5min": 10
    }
  ],
  "final_diagnosis": "Sau sinh thường, mẹ con khỏe"
}
```

---

## Testing

### Backend API Test

```bash
cd backend
node testMedicalFormAPI.js
```

Test sẽ thực hiện:
1. ✅ Đăng nhập
2. ✅ Lấy danh sách bệnh nhân
3. ✅ Lấy template
4. ✅ Tạo bệnh án mới
5. ✅ Lấy bệnh án theo ID
6. ✅ Lấy danh sách bệnh án của bệnh nhân
7. ✅ Lấy danh sách bệnh án của bác sĩ
8. ✅ Cập nhật bệnh án

### Manual Test Frontend

1. **Start Backend**:
```bash
cd backend
npm start
```

2. **Start Frontend**:
```bash
cd frontend
npm run dev
```

3. **Login**: Đăng nhập với tài khoản bác sĩ
4. **Navigate**: Vào menu "Bệnh án Sản khoa"
5. **Test**: Thử tạo, xem, sửa, in bệnh án

---

## Mở rộng

### Thêm Field mới vào Template

**Cách 1: Sửa Seed Script**
1. Mở [seedObstetricTemplate.js](backend/seedObstetricTemplate.js)
2. Thêm field vào section tương ứng:
```javascript
{
  field_name: 'new_field',
  label: 'Field mới',
  type: 'text',
  required: false,
  validation: {
    min: 0,
    max: 100
  },
  help_text: 'Hướng dẫn điền'
}
```
3. Chạy lại seed: `node seedObstetricTemplate.js`

**Cách 2: Update qua API (TODO)**
- Tạo admin panel để quản lý template
- Cho phép thêm/sửa/xóa fields qua UI

### Thêm Loại Bệnh án Mới (ví dụ: Ngoại khoa)

1. **Tạo Seed Script mới**:
```bash
cp seedObstetricTemplate.js seedSurgicalTemplate.js
```

2. **Sửa Schema**: Thay đổi sections và fields phù hợp với khoa Ngoại

3. **Tái sử dụng Code**: Controllers, routes, components đã có, chỉ cần:
   - Thay `obstetric` → `surgical`
   - Update template name và formCode

4. **Update Frontend**: Thêm menu item và routes mới

---

## Lưu ý

### Bảo mật
- ✅ Tất cả endpoints yêu cầu JWT authentication
- ✅ Chỉ bác sĩ mới có quyền tạo/sửa bệnh án
- ✅ Validate dữ liệu cả frontend và backend

### Performance
- ⚡ Lazy loading cho danh sách bệnh án
- ⚡ Pagination (TODO: hiện tại limit 50)
- ⚡ Caching template trong frontend (TODO)

### UX
- 📱 Responsive design (Chakra UI)
- 🎨 Loading states và spinners
- 📝 Helpful error messages
- 🔔 Toast notifications

### Maintenance
- 📚 Code được document đầy đủ
- 🧪 Test scripts sẵn có
- 📖 API documentation ([MEDICAL_FORMS_API.md](backend/MEDICAL_FORMS_API.md))
- 🔄 Git history đầy đủ

---

## Troubleshooting

### Lỗi "Không tìm thấy template"
**Nguyên nhân**: Template chưa được seed vào database
**Giải pháp**:
```bash
cd backend
node seedObstetricTemplate.js
```

### Lỗi "Không có bệnh nhân"
**Nguyên nhân**: Database chưa có bệnh nhân
**Giải pháp**:
```bash
cd backend
node seedPatients.js
```

### Lỗi CORS
**Nguyên nhân**: Frontend và backend chạy khác port
**Giải pháp**: Kiểm tra CORS config trong [server.js](backend/server.js)

### Form không hiển thị đầy đủ
**Nguyên nhân**: Template schema không đúng format
**Giải pháp**: Kiểm tra console log, validate schema

---

## Support

- **Email**: support@hospital.com
- **Documentation**: [MEDICAL_FORMS_API.md](backend/MEDICAL_FORMS_API.md)
- **Test Script**: [testMedicalFormAPI.js](backend/testMedicalFormAPI.js)

---

## License

MIT License - Bệnh viện XYZ
