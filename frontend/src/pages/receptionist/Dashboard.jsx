import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Icon,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdPeople,
  MdHourglassEmpty,
  MdPersonAdd,
  MdLocalHospital,
  MdPhone,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { receptionistAPI, appointmentAPI } from "../../services/api";

const Dashboard = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Load pending appointments
  useEffect(() => {
    loadPendingAppointments();
  }, []);

  const loadPendingAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await receptionistAPI.getPendingAppointments();
      if (response.data.success) {
        setPendingAppointments(response.data.data);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách chờ tiếp nhận",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      setSelectedTimeSlot("");
      setAvailableSlots([]);
      
      // Load doctors for department if department exists
      if (appointment.department) {
        const deptId = typeof appointment.department === 'object' 
          ? appointment.department._id 
          : appointment.department;
        const response = await appointmentAPI.getDoctors(deptId);
        if (response.data.success) {
          setDoctors(response.data.data);
        }
      }

      // Check if appointment already has a doctor
      if (appointment.doctor) {
        const doctorId = typeof appointment.doctor === 'object' 
          ? appointment.doctor._id 
          : appointment.doctor;
        setSelectedDoctor(doctorId);
        
        // Auto-load available slots for the existing doctor
        const session = appointment.time_slot === 'morning' ? 'morning' : 
                       appointment.time_slot === 'afternoon' ? 'afternoon' : 
                       appointment.time_slot;
        const date = appointment.appointment_date;
        
        const slotsResponse = await receptionistAPI.getAvailableSlots(doctorId, date, session);
        if (slotsResponse.data.success) {
          setAvailableSlots(slotsResponse.data.slots || slotsResponse.data.data || []);
        }
      } else {
        setSelectedDoctor("");
      }

      onOpen();
    } catch (error) {
      console.error("Error loading details:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin chi tiết",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleDoctorChange = async (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedTimeSlot("");

    if (!doctorId || !selectedAppointment) return;

    try {
      const session = selectedAppointment.time_slot; // 'morning' or 'afternoon'
      const date = selectedAppointment.appointment_date;
      
      const response = await receptionistAPI.getAvailableSlots(doctorId, date, session);
      if (response.data.success) {
        setAvailableSlots(response.data.data || response.data.slots || []);
      }
    } catch (error) {
      console.error("Error loading slots:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách giờ trống",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleConfirm = async () => {
    if (!selectedTimeSlot || !selectedDoctor) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn bác sĩ và giờ khám",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setIsConfirming(true);
      const response = await receptionistAPI.confirmAppointment(
        selectedAppointment._id,
        {
          time_slot: selectedTimeSlot,
          doctor: selectedDoctor,
          notes
        }
      );

      if (response.data.success) {
        toast({
          title: "Thành công",
          description: "Đã xác nhận lịch hẹn",
          status: "success",
          duration: 3000,
        });
        onClose();
        loadPendingAppointments();
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xác nhận lịch hẹn",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;

    try {
      const response = await receptionistAPI.cancelAppointment(
        selectedAppointment._id,
        "Hủy bởi lễ tân"
      );

      if (response.data.success) {
        toast({
          title: "Đã hủy",
          description: "Lịch hẹn đã được hủy",
          status: "info",
          duration: 3000,
        });
        onClose();
        loadPendingAppointments();
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hủy lịch hẹn",
        status: "error",
        duration: 3000,
      });
    }
  };

  const getSessionLabel = (timeSlot) => {
    if (timeSlot === 'morning') return 'Buổi sáng';
    if (timeSlot === 'afternoon') return 'Buổi chiều';
    return timeSlot;
  };

  // Statistics data
  const stats = [
    {
      title: "Tổng số bệnh nhân",
      subtitle: "Hôm nay",
      value: "87",
      icon: MdPeople,
      color: "teal.500",
      bg: "teal.50",
    },
    {
      title: "Chờ tiếp nhận",
      subtitle: "Đang xử lý",
      value: pendingAppointments.length.toString(),
      icon: MdHourglassEmpty,
      color: "orange.500",
      bg: "orange.50",
    },
    {
      title: "Đăng ký mới",
      subtitle: "Hôm nay",
      value: "24",
      icon: MdPersonAdd,
      color: "blue.500",
      bg: "blue.50",
    },
    {
      title: "Nhập viện",
      subtitle: "Hôm nay",
      value: "6",
      icon: MdLocalHospital,
      color: "purple.500",
      bg: "purple.50",
    },
  ];

  // Waiting patients data
  const waitingPatients = [
    {
      id: 1,
      number: "A001",
      name: "Nguyễn Văn A",
      department: "Khoa Nội",
      status: "Chờ tiếp nhận",
      time: "08:30",
    },
    {
      id: 2,
      number: "A002",
      name: "Trần Thị B",
      department: "Khoa Ngoại",
      status: "Chờ tiếp nhận",
      time: "08:45",
    },
    {
      id: 3,
      number: "A003",
      name: "Lê Văn C",
      department: "Khoa Tai Mũi Họng",
      status: "Đang xử lý",
      time: "09:00",
    },
    {
      id: 4,
      number: "A004",
      name: "Phạm Thị D",
      department: "Khoa Nhi",
      status: "Chờ tiếp nhận",
      time: "09:15",
    },
    {
      id: 5,
      number: "A005",
      name: "Hoàng Văn E",
      department: "Khoa Mắt",
      status: "Chờ tiếp nhận",
      time: "09:30",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ tiếp nhận":
        return "orange";
      case "Đang xử lý":
        return "blue";
      case "Hoàn thành":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Dashboard Lễ Tân
      </Heading>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {stat.title}
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color={stat.color}>
                  {stat.value}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {stat.subtitle}
                </Text>
              </VStack>
              <Box bg={stat.bg} p={3} borderRadius="lg">
                <Icon as={stat.icon} boxSize={8} color={stat.color} />
              </Box>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {/* Waiting Patients Table */}
      <Box bg="white" borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
        <Box p={6} borderBottom="1px solid" borderColor="gray.200">
          <Heading size="md" color="teal.600">
            Bệnh nhân đang chờ tiếp nhận ({pendingAppointments.length})
          </Heading>
        </Box>

        {isLoading ? (
          <Center py={10}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : pendingAppointments.length === 0 ? (
          <Center py={10}>
            <Text color="gray.500">Không có lịch hẹn chờ xác nhận</Text>
          </Center>
        ) : (
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Họ tên</Th>
                <Th>SĐT</Th>
                <Th>Khoa</Th>
                <Th>Ngày khám</Th>
                <Th>Buổi</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pendingAppointments.map((appointment) => (
                <Tr key={appointment._id} _hover={{ bg: "gray.50" }}>
                  <Td fontWeight="semibold">
                    {appointment.patient?.full_name || appointment.patient_name || 'N/A'}
                  </Td>
                  <Td>
                    {appointment.patient?.phone || appointment.patient_phone || 'N/A'}
                  </Td>
                  <Td>{appointment.department?.name || appointment.department || 'N/A'}</Td>
                  <Td>{new Date(appointment.appointment_date).toLocaleDateString('vi-VN')}</Td>
                  <Td>
                    <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                      {getSessionLabel(appointment.time_slot)}
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      leftIcon={<MdPhone />}
                      onClick={() => handleViewDetails(appointment)}
                    >
                      Xác nhận
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Confirm Appointment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận lịch hẹn</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAppointment && (
              <VStack spacing={4} align="stretch">
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="bold" fontSize="lg" mb={2}>Thông tin bệnh nhân</Text>
                  <SimpleGrid columns={2} spacing={2}>
                    <Text><strong>Họ tên:</strong> {selectedAppointment.patient?.full_name || selectedAppointment.patient_name || 'N/A'}</Text>
                    <Text><strong>SĐT:</strong> {selectedAppointment.patient?.phone || selectedAppointment.patient_phone || 'N/A'}</Text>
                    <Text><strong>Email:</strong> {selectedAppointment.patient?.email || selectedAppointment.patient_email || 'N/A'}</Text>
                    <Text><strong>Ngày sinh:</strong> {selectedAppointment.patient?.dob ? new Date(selectedAppointment.patient.dob).toLocaleDateString('vi-VN') : selectedAppointment.patient_dob || 'N/A'}</Text>
                    <Text><strong>Giới tính:</strong> {
                      (selectedAppointment.patient?.gender || selectedAppointment.patient_gender) === 'male' ? 'Nam' : 
                      (selectedAppointment.patient?.gender || selectedAppointment.patient_gender) === 'female' ? 'Nữ' : 'Khác'
                    }</Text>
                    <Text><strong>Buổi khám:</strong> {getSessionLabel(selectedAppointment.time_slot)}</Text>
                  </SimpleGrid>
                  <Text mt={2}><strong>Lý do:</strong> {selectedAppointment.reason || 'Khám bệnh'}</Text>
                </Box>

                <FormControl isRequired>
                  <FormLabel>Bác sĩ khám</FormLabel>
                  <Select
                    placeholder="-- Chọn bác sĩ --"
                    value={selectedDoctor}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                  >
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.full_name} - {doctor.specialty}
                      </option>
                    ))}
                  </Select>
                  {selectedAppointment.doctor && (
                    <Text fontSize="sm" color="blue.600" mt={1}>
                      ℹ️ Bệnh nhân đã chọn bác sĩ này trước đó. Có thể thay đổi nếu cần.
                    </Text>
                  )}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Giờ khám</FormLabel>
                  <Select
                    placeholder="-- Chọn giờ --"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    isDisabled={!selectedDoctor || !availableSlots || availableSlots.length === 0}
                  >
                    {(availableSlots || []).map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </Select>
                  {selectedDoctor && availableSlots.length === 0 && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      Không còn giờ trống trong buổi này
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Ghi chú</FormLabel>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú thêm..."
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              variant="ghost"
              mr={3}
              leftIcon={<MdCancel />}
              onClick={handleCancel}
            >
              Hủy lịch
            </Button>
            <Button
              colorScheme="teal"
              leftIcon={<MdCheckCircle />}
              onClick={handleConfirm}
              isLoading={isConfirming}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Dashboard;
