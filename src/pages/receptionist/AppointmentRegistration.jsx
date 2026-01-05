import { useState } from "react";
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
} from "@chakra-ui/react";
import { MdSearch, MdCalendarToday, MdCheckCircle } from "react-icons/md";

const AppointmentRegistration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [appointmentResult, setAppointmentResult] = useState(null);
  const toast = useToast();

  const handleSearch = () => {
    // Simulate patient search
    if (searchTerm) {
      setSelectedPatient({
        id: "BN001",
        name: "Nguyễn Văn A",
        dob: "15/05/1980",
        gender: "Nam",
        phone: "0912345678",
        insurance: "DN4500123456789",
      });
    }
  };

  const handleRegister = () => {
    setAppointmentResult({
      number: "A012",
      time: "10:30",
      doctor: "BS. Nguyễn Văn B",
      room: "Phòng 101",
    });

    toast({
      title: "Đăng ký thành công",
      description: "Đã tạo phiếu khám cho bệnh nhân",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Fake data for departments and doctors
  const departments = [
    { id: 1, name: "Khoa Nội tổng quát" },
    { id: 2, name: "Khoa Ngoại" },
    { id: 3, name: "Khoa Sản" },
    { id: 4, name: "Khoa Nhi" },
    { id: 5, name: "Khoa Tai Mũi Họng" },
  ];

  const doctors = {
    "Khoa Nội tổng quát": ["BS. Nguyễn Văn A", "BS. Trần Thị B", "BS. Lê Văn C"],
    "Khoa Ngoại": ["BS. Phạm Văn D", "BS. Hoàng Thị E"],
    "Khoa Sản": ["BS. Võ Thị F", "BS. Đặng Văn G"],
    "Khoa Nhi": ["BS. Nguyễn Văn H", "BS. Trần Thị I"],
    "Khoa Tai Mũi Họng": ["BS. Lê Văn K", "BS. Phạm Thị L"],
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
              size="lg"
            />
            <Button
              colorScheme="teal"
              leftIcon={<MdSearch />}
              size="lg"
              onClick={handleSearch}
              minW="150px"
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
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Bác sĩ</FormLabel>
                <Select placeholder="-- Chọn bác sĩ --" isDisabled={!selectedDepartment}>
                  {selectedDepartment &&
                    doctors[selectedDepartment]?.map((doctor, idx) => (
                      <option key={idx} value={doctor}>
                        {doctor}
                      </option>
                    ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Ngày khám</FormLabel>
                <Input type="date" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Giờ khám</FormLabel>
                <Select placeholder="-- Chọn giờ --">
                  <option>08:00 - 09:00</option>
                  <option>09:00 - 10:00</option>
                  <option>10:00 - 11:00</option>
                  <option>13:00 - 14:00</option>
                  <option>14:00 - 15:00</option>
                  <option>15:00 - 16:00</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Hình thức khám</FormLabel>
                <Select placeholder="-- Chọn hình thức --">
                  <option>Khám thường</option>
                  <option>Khám BHYT</option>
                  <option>Khám VIP</option>
                  <option>Khám theo yêu cầu</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Lý do khám</FormLabel>
                <Input placeholder="Nhập lý do khám (tùy chọn)" />
              </FormControl>
            </SimpleGrid>

            <Flex justify="flex-end" gap={3} pt={4}>
              <Button variant="outline" size="lg">
                Hủy
              </Button>
              <Button colorScheme="teal" size="lg" onClick={handleRegister}>
                Xác nhận đăng ký
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
                Số thứ tự
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color="teal.600">
                {appointmentResult.number}
              </Text>
            </Box>

            <Box bg="white" p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Giờ dự kiến
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color="teal.600">
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
