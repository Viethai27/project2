import { useState, useEffect } from "react";
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
  Flex,
  Icon,
  Divider,
  Badge,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { MdSearch, MdCalendarToday, MdCheckCircle } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { patientAPI, appointmentAPI } from "../../services/api";

const AppointmentRegistration = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentResult, setAppointmentResult] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const toast = useToast();

  // Check if patient data was passed from PatientRegistration
  useEffect(() => {
    if (location.state?.patient) {
      const patient = location.state.patient;
      setSelectedPatient({
        _id: patient._id,
        id: patient.patientCode || patient.patientId || patient._id.slice(-6).toUpperCase(),
        name: patient.fullName || patient.full_name || "N/A",
        dob: patient.dateOfBirth || patient.dob ? new Date(patient.dateOfBirth || patient.dob).toLocaleDateString("vi-VN") : "N/A",
        gender: patient.gender === 'female' ? 'Nữ' : patient.gender === 'male' ? 'Nam' : 'Khác',
        phone: patient.phone || patient.user?.phone || "N/A",
        insurance: patient.insurance_number || "Chưa có BHYT",
      });
      setAppointmentResult(null);
    }
  }, [location.state]);

  // Load departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoadingDepts(true);
        const response = await appointmentAPI.getDepartments();
        console.log("📋 Departments response:", response.data);
        // response.data is already the JSON from backend: { success: true, data: [...] }
        if (response.data?.success && response.data?.data) {
          setDepartments(response.data.data);
          console.log("✅ Loaded", response.data.data.length, "departments");
        } else {
          console.log("⚠️ Unexpected response format:", response.data);
          setDepartments([]);
        }
      } catch (error) {
        console.error("❌ Error fetching departments:", error);
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể tải danh sách khoa",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, [toast]);

  // Load doctors when department changes
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedDepartment) {
        setDoctors([]);
        return;
      }

      try {
        setIsLoadingDoctors(true);
        const response = await appointmentAPI.getDoctors(selectedDepartment);
        console.log("👨‍⚕️ Doctors response:", response.data);
        if (response.data?.success && response.data?.data) {
          setDoctors(response.data.data);
          console.log("✅ Loaded", response.data.data.length, "doctors");
        } else {
          console.log("⚠️ Unexpected doctors response:", response.data);
          setDoctors([]);
        }
      } catch (error) {
        console.error("❌ Error fetching doctors:", error);
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể tải danh sách bác sĩ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [selectedDepartment, toast]);

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
      console.log("Search result:", response.data);
      
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
        });
        setAppointmentResult(null);
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

  const handleRegister = async () => {
    if (!selectedPatient || !selectedDepartment || !selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin đăng ký",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsRegistering(true);
      const appointmentData = {
        patient: selectedPatient._id,
        doctor: selectedDoctor,
        department: selectedDepartment,
        appointment_date: selectedDate,
        time_slot: selectedTime,
        reason: reason || "Khám bệnh",
        status: "pending",
      };

      const response = await appointmentAPI.create(appointmentData);
      console.log("Appointment created:", response.data);

      if (response.data.success) {
        setAppointmentResult({
          number: response.data.appointment?.appointmentNumber || "N/A",
          time: selectedTime,
          doctor: doctors.find(d => d._id === selectedDoctor)?.full_name || "N/A",
          room: "Phòng khám",
          date: new Date(selectedDate).toLocaleDateString("vi-VN"),
        });

        toast({
          title: "Đăng ký thành công",
          description: "Đã tạo phiếu khám cho bệnh nhân",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể đăng ký khám",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Đăng ký khám
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              size="lg"
            />
            <Button
              colorScheme="teal"
              leftIcon={isSearching ? null : <MdSearch />}
              size="lg"
              onClick={handleSearch}
              minW="150px"
              isLoading={isSearching}
              loadingText="Đang tìm..."
            >
              Tìm kiếm
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Patient Information (Read-only) */}
      {selectedPatient && (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
          <HStack mb={4}>
            <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
            <Heading size="md" color="teal.600">
              Thông tin bệnh nhân
            </Heading>
            <Badge colorScheme="green" px={3} py={1} ml="auto">
              Đã xác nhận
            </Badge>
          </HStack>

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
                Số điện thoại
              </Text>
              <Text fontWeight="bold">{selectedPatient.phone}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">
                Mã BHYT
              </Text>
              <Text fontWeight="bold">{selectedPatient.insurance}</Text>
            </Box>
          </SimpleGrid>
        </Box>
      )}

      {/* Registration Form */}
      {selectedPatient && !appointmentResult && (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
          <VStack spacing={6} align="stretch">
            <HStack>
              <Icon as={MdCalendarToday} boxSize={6} color="teal.500" />
              <Heading size="md" color="teal.600">
                Thông tin đăng ký khám
              </Heading>
            </HStack>

            <Divider />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Khoa khám</FormLabel>
                <Select
                  placeholder="-- Chọn khoa --"
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedDoctor("");
                  }}
                  isDisabled={isLoadingDepts}
                >
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
<FormLabel fontWeight="semibold">Bác sĩ</FormLabel>
                <Select 
                  placeholder={isLoadingDoctors ? "Đang tải..." : "-- Chọn bác sĩ --"} 
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  isDisabled={!selectedDepartment || isLoadingDoctors}
                >
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.full_name || "Bác sĩ"}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Ngày khám</FormLabel>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Giờ khám</FormLabel>
                <Select
                  placeholder="-- Chọn giờ --"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="08:00">08:00 - 08:30</option>
                  <option value="08:30">08:30 - 09:00</option>
                  <option value="09:00">09:00 - 09:30</option>
                  <option value="09:30">09:30 - 10:00</option>
                  <option value="10:00">10:00 - 10:30</option>
                  <option value="10:30">10:30 - 11:00</option>
                  <option value="13:00">13:00 - 13:30</option>
                  <option value="13:30">13:30 - 14:00</option>
                  <option value="14:00">14:00 - 14:30</option>
                  <option value="14:30">14:30 - 15:00</option>
                  <option value="15:00">15:00 - 15:30</option>
                  <option value="15:30">15:30 - 16:00</option>
                </Select>
              </FormControl>

              <FormControl gridColumn={{ base: "1", md: "1 / -1" }}>
                <FormLabel fontWeight="semibold">Lý do khám</FormLabel>
                <Input
                  placeholder="Nhập lý do khám bệnh..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </FormControl>
            </SimpleGrid>

            <Flex justify="flex-end" mt={4}>
              <Button
                colorScheme="teal"
                size="lg"
                px={8}
                onClick={handleRegister}
                isLoading={isRegistering}
                loadingText="Đang đăng ký..."
              >
                Đăng ký khám
              </Button>
            </Flex>
          </VStack>
        </Box>
      )}

      {/* Registration Result */}
      {appointmentResult && (
        <Box
          bg="green.50"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          border="2px solid"
          borderColor="green.400"
          textAlign="center"
        >
          <Icon as={MdCheckCircle} boxSize={16} color="green.500" mb={4} />
          <Heading size="lg" color="green.700" mb={4}>
            Đăng ký khám thành công!
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="600px" mx="auto" mb={6}>
            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Ngày khám
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {appointmentResult.date}
              </Text>
            </Box>

            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Giờ dự kiến
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                {appointmentResult.time}
              </Text>
            </Box>

            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Bác sĩ
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {appointmentResult.doctor}
              </Text>
            </Box>

            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Phòng khám
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {appointmentResult.room}
              </Text>
            </Box>
          </SimpleGrid>

          <HStack justify="center" spacing={4}>
            <Button colorScheme="green" size="lg">
              In phiếu khám
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              size="lg"
              onClick={() => {
                setAppointmentResult(null);
                setSelectedPatient(null);
                setSelectedDepartment("");
                setSelectedDoctor("");
                setSelectedDate("");
                setSelectedTime("");
                setReason("");
                setSearchTerm("");
              }}
            >
              Đăng ký mới
            </Button>
          </HStack>
        </Box>
      )}
    </Container>
  );
};

export default AppointmentRegistration;
