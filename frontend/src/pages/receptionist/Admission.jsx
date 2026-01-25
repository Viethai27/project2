import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  SimpleGrid,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Flex,
  Icon,
  Divider,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { MdSearch, MdLocalHospital, MdBed, MdCheckCircle, MdPrint } from "react-icons/md";
import { patientAPI } from "../../services/api";

const Admission = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [admissionSuccess, setAdmissionSuccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
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

  const handleEmergencyAdmission = async () => {
    try {
      setIsSearching(true);
      
      // Tạo patient record trong database ngay với thông tin tạm thời
      const emergencyPatientData = {
        full_name: "Bệnh nhân cấp cứu - Chưa rõ danh tính",
        gender: "male", // Default, sẽ cập nhật sau
        phone: "N/A", // Đánh dấu là chưa có thông tin
        id_card: "N/A",
        address: "N/A",
      };
      
      console.log('Creating emergency patient record:', emergencyPatientData);
      const response = await patientAPI.create(emergencyPatientData);
      
      if (response.data.success) {
        const patient = response.data.patient;
        
        // Set patient đã tạo vào form
        setSelectedPatient({
          _id: patient._id,
          id: patient.patientCode || patient._id.slice(-6).toUpperCase(),
          name: patient.full_name,
          dob: "Chưa xác định",
          gender: "Chưa xác định",
          phone: "Chưa có",
          insurance: "Chưa có BHYT",
          diagnosis: "Cấp cứu - Chờ khai thác thông tin",
          doctor: "Bác sĩ trực cấp cứu",
          isEmergencyCase: true,
        });
        
        setIsEmergency(true);
        
        toast({
          title: "Đã tạo hồ sơ cấp cứu",
          description: "Bệnh nhân đã được tạo trong hệ thống. Có thể cập nhật thông tin sau.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating emergency patient:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
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

  const handleAdmit = () => {
    setAdmissionSuccess(true);
    toast({
      title: "Nhập viện thành công",
      description: "Đã tạo đợt nhập viện cho bệnh nhân",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

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
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Nhập viện
      </Heading>

      {/* Search Patient */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <Text fontWeight="bold" fontSize="lg" color="teal.600">
            Tìm kiếm bệnh nhân
          </Text>

          <HStack>
            <Input
              placeholder="Nhập mã BN / CCCD / SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="lg"
            />
            <Button
              colorScheme="teal"
              leftIcon={<MdSearch />}
              size="lg"
              onClick={handleSearch}
              minW="150px"
              isLoading={isSearching}
              loadingText="Đang tìm..."
            >
              Tìm kiếm
            </Button>
          </HStack>
          
          <Divider />
          
          <Box bg="red.50" p={4} borderRadius="md" border="1px solid" borderColor="red.200">
            <VStack align="stretch" spacing={3}>
              <HStack>
                <Icon as={MdLocalHospital} color="red.600" boxSize={5} />
                <Text fontWeight="bold" color="red.700">
                  Trường hợp cấp cứu
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.700">
                Nếu bệnh nhân đến trong tình trạng cấp cứu và không thể khai thác thông tin,
                vui lòng sử dụng chế độ nhập viện cấp cứu. Thông tin bệnh nhân có thể được cập nhật sau.
              </Text>
              <Button
                colorScheme="red"
                size="md"
                onClick={handleEmergencyAdmission}
                leftIcon={<MdLocalHospital />}
              >
                Nhập viện cấp cứu - Không rõ danh tính
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Patient Information */}
      {selectedPatient && !admissionSuccess && (
        <>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
            <HStack mb={4} justify="space-between">
              <HStack>
                <Icon as={MdLocalHospital} boxSize={6} color="purple.500" />
                <Heading size="md" color="teal.600">
                  Thông tin bệnh nhân
                </Heading>
              </HStack>
              {selectedPatient.isEmergencyCase && (
                <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                  CẤP CỨU - CHƯA RÕ DANH TÍNH
                </Badge>
              )}
            </HStack>
            
            {selectedPatient.isEmergencyCase && (
              <Box bg="orange.50" p={3} borderRadius="md" mb={4} border="1px solid" borderColor="orange.200">
                <Text fontSize="sm" color="orange.800">
                  <strong>Lưu ý:</strong> Đây là bệnh nhân cấp cứu chưa rõ danh tính. Vui lòng cập nhật thông tin đầy đủ khi có thể.
                </Text>
              </Box>
            )}

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Mã bệnh nhân
                </Text>
                <Text fontWeight="bold">{selectedPatient.id}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Họ tên
                </Text>
                <Text fontWeight="bold">{selectedPatient.name}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Ngày sinh
                </Text>
                <Text fontWeight="bold">{selectedPatient.dob}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Giới tính
                </Text>
                <Text fontWeight="bold">{selectedPatient.gender}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Bác sĩ chỉ định
                </Text>
                <Text fontWeight="bold">{selectedPatient.doctor}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Chẩn đoán ban đầu
                </Text>
                <Text fontWeight="bold" color="red.600">
                  {selectedPatient.diagnosis}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Admission Form */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
            <VStack spacing={6} align="stretch">
              <HStack>
                <Icon as={MdBed} boxSize={6} color="teal.500" />
                <Heading size="md" color="teal.600">
                  Phân giường
                </Heading>
              </HStack>

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Khoa điều trị</FormLabel>
                  <Select
                    placeholder="-- Chọn khoa --"
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setSelectedRoom("");
                    }}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Phòng</FormLabel>
                  <Select
                    placeholder="-- Chọn phòng --"
                    isDisabled={!selectedDepartment}
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                  >
                    {selectedDepartment &&
                      rooms[selectedDepartment]?.map((room, idx) => (
                        <option key={idx} value={room}>
                          {room}
                        </option>
                      ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Giường</FormLabel>
                  <Select placeholder="-- Chọn giường --" isDisabled={!selectedRoom}>
                    {selectedRoom &&
                      beds[selectedRoom]?.map((bed, idx) => (
                        <option key={idx} value={bed}>
                          {bed} {idx % 2 === 0 ? "(Trống)" : "(Đã sử dụng)"}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Thời gian nhập viện</FormLabel>
                  <Input type="datetime-local" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Loại nhập viện</FormLabel>
                  <Select placeholder="-- Chọn loại --">
                    <option>Nhập viện điều trị</option>
                    <option>Nhập viện phẫu thuật</option>
                    <option>Nhập viện cấp cứu</option>
                    <option>Nhập viện theo yêu cầu</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel fontWeight="semibold">Lý do nhập viện</FormLabel>
                <Textarea
                  placeholder="Nhập lý do nhập viện..."
                  defaultValue={selectedPatient.diagnosis}
                  minH="100px"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Ghi chú</FormLabel>
                <Textarea placeholder="Nhập ghi chú thêm..." minH="80px" />
              </FormControl>

              <Flex justify="flex-end" gap={3} pt={4}>
                <Button variant="outline" size="lg">
                  Hủy
                </Button>
                <Button colorScheme="teal" size="lg" onClick={handleAdmit}>
                  Xác nhận nhập viện
                </Button>
              </Flex>
            </VStack>
          </Box>
        </>
      )}

      {/* Admission Success */}
      {admissionSuccess && (
        <Box
          bg="purple.50"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          border="2px solid"
          borderColor="purple.400"
          textAlign="center"
        >
          <Icon as={MdCheckCircle} boxSize={16} color="purple.500" mb={4} />
          <Heading size="lg" color="purple.700" mb={4}>
            Nhập viện thành công!
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="600px" mx="auto" mb={6}>
            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Mã nhập viện
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                NV20250105001
              </Text>
            </Box>

            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Vị trí
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {selectedRoom} - Giường 1
              </Text>
            </Box>

            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Khoa điều trị
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {selectedDepartment}
              </Text>
            </Box>

            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Trạng thái
              </Text>
              <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                Đang điều trị
              </Badge>
            </Box>
          </SimpleGrid>

          {isEmergency && selectedPatient?.isEmergencyCase && (
            <Box bg="orange.50" p={4} borderRadius="md" mb={4} border="1px solid" borderColor="orange.300">
              <VStack spacing={3}>
                <HStack>
                  <Icon as={MdLocalHospital} color="orange.600" boxSize={5} />
                  <Text fontWeight="bold" color="orange.800">
                    Bệnh nhân cấp cứu chưa có thông tin đầy đủ
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.700" textAlign="center">
                  Vui lòng cập nhật thông tin bệnh nhân khi có thể để hoàn thiện hồ sơ
                </Text>
                <Button
                  colorScheme="orange"
                  size="md"
                  onClick={() => setShowUpdateForm(true)}
                >
                  Cập nhật thông tin bệnh nhân ngay
                </Button>
              </VStack>
            </Box>
          )}

          <HStack justify="center" spacing={4}>
            <Button colorScheme="purple" size="lg" leftIcon={<MdPrint />}>
              In giấy nhập viện
            </Button>
            {isEmergency && selectedPatient?.isEmergencyCase && (
              <Button
                colorScheme="orange"
                variant="outline"
                size="lg"
                onClick={() => setShowUpdateForm(true)}
              >
                Cập nhật thông tin
              </Button>
            )}
            <Button
              variant="outline"
              colorScheme="purple"
              size="lg"
              onClick={() => {
                setAdmissionSuccess(false);
                setSelectedPatient(null);
                setSearchTerm("");
                setSelectedDepartment("");
                setSelectedRoom("");
                setIsEmergency(false);
                setShowUpdateForm(false);
              }}
            >
              Nhập viện mới
            </Button>
          </HStack>
        </Box>
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
