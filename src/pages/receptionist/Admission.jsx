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
  Textarea,
  Flex,
  Icon,
  Divider,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { MdSearch, MdLocalHospital, MdBed, MdCheckCircle, MdPrint } from "react-icons/md";

const Admission = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [admissionSuccess, setAdmissionSuccess] = useState(false);
  const toast = useToast();

  const handleSearch = () => {
    if (searchTerm) {
      setSelectedPatient({
        id: "BN001",
        name: "Nguyễn Văn A",
        dob: "15/05/1980",
        gender: "Nam",
        phone: "0912345678",
        insurance: "DN4500123456789",
        diagnosis: "Viêm phổi cấp",
        doctor: "BS. Nguyễn Văn B",
      });
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
            >
              Tìm kiếm
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Patient Information */}
      {selectedPatient && !admissionSuccess && (
        <>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
            <HStack mb={4}>
              <Icon as={MdLocalHospital} boxSize={6} color="purple.500" />
              <Heading size="md" color="teal.600">
                Thông tin bệnh nhân
              </Heading>
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

          <HStack justify="center" spacing={4}>
            <Button colorScheme="purple" size="lg" leftIcon={<MdPrint />}>
              In giấy nhập viện
            </Button>
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
              }}
            >
              Nhập viện mới
            </Button>
          </HStack>
        </Box>
      )}
    </Container>
  );
};

export default Admission;
