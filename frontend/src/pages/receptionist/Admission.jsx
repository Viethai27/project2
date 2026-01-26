import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, useToast } from "@chakra-ui/react";
import SearchPatient from "../../components/receptionist/SearchPatient";
import PatientInfo from "../../components/receptionist/PatientInfo";
import NormalAdmissionForm from "../../components/receptionist/NormalAdmissionForm";
import AdmissionSuccess from "../../components/receptionist/AdmissionSuccess";
import { patientAPI } from "../../services/api";

const Admission = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [admissionSuccess, setAdmissionSuccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // const [isEmergency, setIsEmergency] = useState(false); // Removed, use selectedPatient.isEmergencyCase only
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    fullName: "",
    dob: "",
    gender: "male",
    idCard: "",
    phone: "",
    email: "",
    address: "",
  });
  const toast = useToast();

  // Auto-fill patient data if navigated from PatientRegistration
  useEffect(() => {
    if (location.state?.patient) {
      const patient = location.state.patient;
      console.log('📋 Auto-filling admission form with patient:', patient);
      setSelectedPatient({
        _id: patient._id,
        id: patient.patientCode || patient._id.slice(-6).toUpperCase(),
        name: patient.full_name || patient.user?.fullName || patient.user?.username || "N/A",
        dob: patient.dob ? new Date(patient.dob).toLocaleDateString("vi-VN") : "N/A",
        gender: patient.gender === 'female' ? 'Nữ' : patient.gender === 'male' ? 'Nam' : 'Khác',
        phone: patient.user?.phone || patient.phone || "N/A",
        insurance: patient.insurance_number || "Chưa có BHYT",
        diagnosis: patient.diagnosis || "Chưa có chẩn đoán",
        doctor: patient.doctor || "Chưa phân bác sĩ",
      });
      setSearchTerm(patient.phone || patient.id_card || patient.full_name || "");
      toast({
        title: "Thông tin bệnh nhân đã được tải",
        description: `Bệnh nhân: ${patient.full_name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [location.state, toast]);

    // const [isEmergency, setIsEmergency] = useState(false); // No longer needed
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Thông báo",
        description: "Vui lòng nhập thông tin tìm kiếm",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSearching(true);
      const response = await patientAPI.search(searchTerm.trim());
      
      if (response.data.success && response.data.patient) {
        const patient = response.data.patient;
        setSelectedPatient({
          _id: patient._id,
          id: patient.patientCode || patient._id.slice(-6).toUpperCase(),
          name: patient.full_name || patient.user?.username || "N/A",
          dob: patient.dob ? new Date(patient.dob).toLocaleDateString("vi-VN") : "N/A",
          gender: patient.gender === 'female' ? 'Nữ' : patient.gender === 'male' ? 'Nam' : 'Khác',
          phone: patient.user?.phone || patient.phone || "N/A",
          insurance: patient.insurance_number || "Chưa có BHYT",
          diagnosis: patient.diagnosis || "Chưa có chẩn đoán",
          doctor: patient.doctor || "Chưa phân bác sĩ",
        });
        toast({
          title: "Tìm thấy bệnh nhân",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Không tìm thấy",
          description: "Không tìm thấy bệnh nhân với thông tin này",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error("Error searching patient:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không tìm thấy bệnh nhân",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSelectedPatient(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Đổi lại: chỉ tạo bệnh nhân tạm thời khi nhấn xác nhận nhập viện
  const handleAdmit = async () => {
    // Validate required fields
    if (!selectedDepartment || !selectedRoom) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn đầy đủ khoa, phòng (và giường nếu có)",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsSearching(true);
      // Chuẩn bị dữ liệu bệnh nhân tạm thời
      const emergencyPatientData = {
        full_name: selectedPatient?.name || "Bệnh nhân cấp cứu - Chưa rõ danh tính",
        gender: selectedPatient?.gender === "Nam" ? "male" : selectedPatient?.gender === "Nữ" ? "female" : "male",
        phone: selectedPatient?.phone || "N/A",
        id_card: selectedPatient?.idCard || "N/A",
        address: selectedPatient?.address || "N/A",
        department: selectedDepartment,
        room: selectedRoom,
        bed: null, // Có thể bổ sung nếu có chọn giường
        diagnosis: selectedPatient?.diagnosis || "Cấp cứu - Chờ khai thác thông tin",
        isEmergencyCase: true,
      };
      const response = await patientAPI.create(emergencyPatientData);
      if (response.data.success) {
        const patient = response.data.patient;
        setSelectedPatient({
          ...selectedPatient,
          _id: patient._id,
          id: patient.patientCode || patient._id.slice(-6).toUpperCase(),
          name: patient.full_name,
          isEmergencyCase: true,
        });
        setAdmissionSuccess(true);
        toast({
          title: "Nhập viện thành công",
          description: "Đã tạo bệnh nhân cấp cứu tạm thời. Có thể cập nhật thông tin sau.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tạo hồ sơ cấp cứu",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpdatePatientInfo = async () => {
    if (!updateFormData.fullName.trim() || !updateFormData.phone.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập ít nhất họ tên và số điện thoại",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      // Chuẩn bị data để update
      const patientData = {
        full_name: updateFormData.fullName.trim(),
        gender: updateFormData.gender,
        phone: updateFormData.phone.trim(),
      };
      
      // Chỉ thêm các trường optional nếu có giá trị
      if (updateFormData.dob) {
        patientData.dob = updateFormData.dob;
      }
      
      if (updateFormData.idCard && updateFormData.idCard.trim()) {
        patientData.id_card = updateFormData.idCard.trim();
      }
      
      if (updateFormData.email && updateFormData.email.trim()) {
        patientData.email = updateFormData.email.trim();
      }
      
      if (updateFormData.address && updateFormData.address.trim()) {
        patientData.address = updateFormData.address.trim();
      }
      
      let response;
      
      // Nếu đã có _id (emergency patient), UPDATE thay vì CREATE
      if (selectedPatient._id && selectedPatient.isEmergencyCase) {
        console.log('Updating emergency patient:', selectedPatient._id, patientData);
        response = await patientAPI.update(selectedPatient._id, patientData);
      } else {
        console.log('Creating new patient with data:', patientData);
        response = await patientAPI.create(patientData);
      }
      
      if (response.data.success) {
        const updatedPatient = response.data.patient || response.data.data;
        
        // Cập nhật thông tin patient đã chọn
        setSelectedPatient({
          ...selectedPatient,
          _id: updatedPatient._id,
          id: updatedPatient.patientCode || updatedPatient._id.slice(-6).toUpperCase(),
          name: updatedPatient.full_name,
          dob: updatedPatient.dob ? new Date(updatedPatient.dob).toLocaleDateString("vi-VN") : "N/A",
          gender: updatedPatient.gender === 'female' ? 'Nữ' : updatedPatient.gender === 'male' ? 'Nam' : 'Khác',
          phone: updatedPatient.phone || updatedPatient.user?.phone,
          isEmergencyCase: false,
        });
        
        setShowUpdateForm(false);
        setIsEmergency(false);
        
        toast({
          title: "Cập nhật thành công",
          description: "Đã cập nhật thông tin bệnh nhân",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật thông tin bệnh nhân",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // ...existing code...

  // Fake data
  const departments = [
    { id: 1, name: "Khoa Nội tổng quát" },
    { id: 2, name: "Khoa Ngoại" },
    { id: 3, name: "Khoa Sản" },
    { id: 4, name: "Khoa Nhi" },
  ];

  const rooms = {
    "Khoa Nội tổng quát": ["Phòng 201", "Phòng 202", "Phòng 203"],
    "Khoa Ngoại": ["Phòng 301", "Phòng 302"],
    "Khoa Sản": ["Phòng 401", "Phòng 402"],
    "Khoa Nhi": ["Phòng 501", "Phòng 502"],
  };

  const beds = {
    "Phòng 201": ["Giường 1", "Giường 2", "Giường 3"],
    "Phòng 202": ["Giường 4", "Giường 5"],
    "Phòng 203": ["Giường 6", "Giường 7", "Giường 8"],
  };


  return (
    <Container maxW="7xl" py={6}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#4A5568', marginBottom: 24 }}>Nhập viện</h1>
      <SearchPatient
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearching={isSearching}
        handleSearch={handleSearch}
        onEmergencyClick={() => setSelectedPatient({
          id: "ECU-" + Date.now(),
          name: "Bệnh nhân cấp cứu - Chưa rõ danh tính",
          dob: "N/A",
          gender: "male",
          phone: "N/A",
          insurance: "Chưa có BHYT",
          diagnosis: "Cấp cứu - Chờ khai thác thông tin",
          doctor: "Chưa phân bác sĩ",
          isEmergencyCase: true
        })}
      />

      {selectedPatient && !admissionSuccess && (
        <>
          <PatientInfo patient={selectedPatient} />
          <NormalAdmissionForm
            departments={departments}
            rooms={rooms}
            beds={beds}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            diagnosis={selectedPatient.diagnosis}
            onCancel={() => setSelectedPatient(null)}
            onAdmit={handleAdmit}
          />
        </>
      )}

      {admissionSuccess && (
        <AdmissionSuccess
          onNewAdmission={() => {
            setAdmissionSuccess(false);
            setSelectedPatient(null);
            setSearchTerm("");
            setSelectedDepartment("");
            setSelectedRoom("");
            setShowUpdateForm(false);
          }}
        />
      )}

      {/* Form cập nhật thông tin bệnh nhân cấp cứu */}
      {showUpdateForm && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          zIndex="1000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => setShowUpdateForm(false)}
        >
          <Box
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="2xl"
            maxW="800px"
            w="90%"
            maxH="90vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Heading size="lg" color="teal.600">
                  Cập nhật thông tin bệnh nhân
                </Heading>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpdateForm(false)}
                >
                  ✕
                </Button>
              </HStack>

              <Divider />

              <Text fontSize="sm" color="orange.700" bg="orange.50" p={3} borderRadius="md">
                <strong>Lưu ý:</strong> Đây là bệnh nhân cấp cứu chưa rõ danh tính. Vui lòng cập nhật thông tin để hoàn thiện hồ sơ.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Họ và tên</FormLabel>
                  <Input
                    placeholder="Nhập họ tên đầy đủ"
                    value={updateFormData.fullName}
                    onChange={(e) => setUpdateFormData({...updateFormData, fullName: e.target.value})}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Ngày sinh</FormLabel>
                  <Input
                    type="date"
                    value={updateFormData.dob}
                    onChange={(e) => setUpdateFormData({...updateFormData, dob: e.target.value})}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Giới tính</FormLabel>
                  <Select
                    value={updateFormData.gender}
                    onChange={(e) => setUpdateFormData({...updateFormData, gender: e.target.value})}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>CCCD/CMND</FormLabel>
                  <Input
                    placeholder="Nhập số CCCD"
                    value={updateFormData.idCard}
                    onChange={(e) => setUpdateFormData({...updateFormData, idCard: e.target.value})}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Số điện thoại</FormLabel>
                  <Input
                    placeholder="Nhập số điện thoại"
                    value={updateFormData.phone}
                    onChange={(e) => setUpdateFormData({...updateFormData, phone: e.target.value})}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Nhập email"
                    value={updateFormData.email}
                    onChange={(e) => setUpdateFormData({...updateFormData, email: e.target.value})}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Địa chỉ</FormLabel>
                <Input
                  placeholder="Nhập địa chỉ"
                  value={updateFormData.address}
                  onChange={(e) => setUpdateFormData({...updateFormData, address: e.target.value})}
                />
              </FormControl>

              <Divider />

              <HStack justify="flex-end" spacing={3}>
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Hủy
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={handleUpdatePatientInfo}
                  isLoading={isUpdating}
                  loadingText="Đang lưu..."
                >
                  Lưu thông tin
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Admission;
