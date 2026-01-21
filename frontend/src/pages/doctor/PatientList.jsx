import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Flex,
  Icon,
  HStack,
  Text,
} from "@chakra-ui/react";
import { MdSearch, MdVisibility, MdDescription } from "react-icons/md";

const PatientList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const handleViewPatient = (patientId) => {
    // Navigate to patient details page
    console.log('Xem thông tin bệnh nhân:', patientId);
    // You can add navigation here when patient detail page is ready
    // navigate(`/doctor/patients/${patientId}`);
  };

  const handleViewMedicalRecord = (patientId) => {
    // Navigate to medical records page with patient filter
    console.log('Xem bệnh án của bệnh nhân:', patientId);
    navigate('/doctor/medical-records', { state: { patientId } });
  };

  // Fake patient data - Khoa Sản
  const patients = [
    {
      id: "BN001",
      name: "Nguyễn Thị Mai Anh",
      age: 30,
      gender: "Nữ",
      phone: "0912345678",
      type: "Ngoại trú",
      lastVisit: "20/12/2025",
      diagnosis: "Thai 12 tuần",
      status: "Đang theo dõi",
    },
    {
      id: "BN002",
      name: "Trần Thị Hương",
      age: 35,
      gender: "Nữ",
      phone: "0923456789",
      type: "Ngoại trú",
      lastVisit: "18/12/2025",
      diagnosis: "Thai 28 tuần - Tiền sản giật",
      status: "Đang điều trị",
    },
    {
      id: "BN003",
      name: "Lê Thị Phương",
      age: 37,
      gender: "Nữ",
      phone: "0934567890",
      type: "Ngoại trú",
      lastVisit: "22/12/2025",
      diagnosis: "Thai 35 tuần - Đái tháo đường thai kỳ",
      status: "Đang điều trị",
    },
    {
      id: "BN004",
      name: "Phạm Thị Lan",
      age: 33,
      gender: "Nữ",
      phone: "0945678901",
      type: "Ngoại trú",
      lastVisit: "15/12/2025",
      diagnosis: "Thai 20 tuần - Thai đôi",
      status: "Đang theo dõi",
    },
    {
      id: "BN005",
      name: "Hoàng Thị Thu",
      age: 32,
      gender: "Nữ",
      phone: "0956789012",
      type: "Ngoại trú",
      lastVisit: "25/12/2025",
      diagnosis: "Sau sinh 2 tuần - Kiểm tra sức khỏe",
      status: "Tái khám",
    },
    {
      id: "BN006",
      name: "Vũ Thị Hoa",
      age: 29,
      gender: "Nữ",
      phone: "0967890123",
      type: "Ngoại trú",
      lastVisit: "19/12/2025",
      diagnosis: "Thai 8 tuần - Khám thai định kỳ",
      status: "Đang theo dõi",
    },
    {
      id: "BN007",
      name: "Đỗ Thị Ngọc",
      age: 34,
      gender: "Nữ",
      phone: "0978901234",
      type: "Ngoại trú",
      lastVisit: "21/12/2025",
      diagnosis: "Thai 32 tuần - Ngôi ngược",
      status: "Đang điều trị",
    },
    {
      id: "BN008",
      name: "Bùi Thị Thanh",
      age: 31,
      gender: "Nữ",
      phone: "0989012345",
      type: "Ngoại trú",
      lastVisit: "17/12/2025",
      diagnosis: "Thai 16 tuần - Sàng lọc NIPT",
      status: "Đang theo dõi",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang điều trị":
        return "blue";
      case "Đang theo dõi":
        return "green";
      case "Tái khám":
        return "orange";
      case "Hoàn thành":
        return "gray";
      default:
        return "gray";
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);

    const matchesFilter = filterType === "all" || patient.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Danh sách bệnh nhân
      </Heading>

      {/* Filters */}
      <Flex gap={4} mb={6} flexWrap="wrap">
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <Icon as={MdSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Tìm kiếm theo tên, mã BN, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            borderColor="gray.300"
          />
        </InputGroup>

        <Select
          maxW="200px"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          bg="white"
          borderColor="gray.300"
        >
          <option value="all">Tất cả</option>
          <option value="Ngoại trú">Ngoại trú</option>
          <option value="Nội trú">Nội trú</option>
        </Select>
      </Flex>

      {/* Patient Table */}
      <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden" border="1px solid" borderColor="gray.200">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Mã BN</Th>
              <Th>Họ tên</Th>
              <Th>Tuổi</Th>
              <Th>Giới tính</Th>
              <Th>SĐT</Th>
              <Th>Loại</Th>
              <Th>Lần khám cuối</Th>
              <Th>Chẩn đoán</Th>
              <Th>Trạng thái</Th>
              <Th>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <Tr key={patient.id} _hover={{ bg: "gray.50" }}>
                  <Td fontWeight="bold" color="blue.600">
                    {patient.id}
                  </Td>
                  <Td fontWeight="semibold">{patient.name}</Td>
                  <Td>{patient.age}</Td>
                  <Td>{patient.gender}</Td>
                  <Td>{patient.phone}</Td>
                  <Td>
                    <Badge colorScheme={patient.type === "Nội trú" ? "purple" : "cyan"}>
                      {patient.type}
                    </Badge>
                  </Td>
                  <Td>{patient.lastVisit}</Td>
                  <Td>{patient.diagnosis}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(patient.status)} px={2} py={1} borderRadius="md">
                      {patient.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        leftIcon={<MdVisibility />}
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        Xem
                      </Button>
                      <Button 
                        size="sm" 
                        colorScheme="green" 
                        leftIcon={<MdDescription />}
                        onClick={() => handleViewMedicalRecord(patient.id)}
                      >
                        Bệnh án
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={10} textAlign="center" py={8}>
                  <Text color="gray.500">Không tìm thấy bệnh nhân</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default PatientList;
