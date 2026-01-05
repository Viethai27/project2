import { useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Fake patient data
  const patients = [
    {
      id: "BN001",
      name: "Nguyễn Văn A",
      age: 45,
      gender: "Nam",
      phone: "0912345678",
      type: "Ngoại trú",
      lastVisit: "20/12/2025",
      diagnosis: "Cao huyết áp",
      status: "Đang điều trị",
    },
    {
      id: "BN002",
      name: "Trần Thị B",
      age: 35,
      gender: "Nữ",
      phone: "0987654321",
      type: "Ngoại trú",
      lastVisit: "18/12/2025",
      diagnosis: "Đái tháo đường type 2",
      status: "Tái khám",
    },
    {
      id: "BN003",
      name: "Lê Văn C",
      age: 60,
      gender: "Nam",
      phone: "0923456789",
      type: "Nội trú",
      lastVisit: "15/12/2025",
      diagnosis: "Viêm phổi",
      status: "Đang điều trị",
    },
    {
      id: "BN004",
      name: "Phạm Thị D",
      age: 28,
      gender: "Nữ",
      phone: "0934567890",
      type: "Ngoại trú",
      lastVisit: "22/12/2025",
      diagnosis: "Viêm amidan",
      status: "Hoàn thành",
    },
    {
      id: "BN005",
      name: "Hoàng Văn E",
      age: 52,
      gender: "Nam",
      phone: "0945678901",
      type: "Nội trú",
      lastVisit: "10/12/2025",
      diagnosis: "Suy tim",
      status: "Đang điều trị",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang điều trị":
        return "blue";
      case "Tái khám":
        return "orange";
      case "Hoàn thành":
        return "green";
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
                      <Button size="sm" colorScheme="blue" leftIcon={<MdVisibility />}>
                        Xem
                      </Button>
                      <Button size="sm" colorScheme="green" leftIcon={<MdDescription />}>
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
