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
  VStack,
} from "@chakra-ui/react";
import { MdSearch, MdVisibility, MdHistory } from "react-icons/md";

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Fake patient data
  const patients = [
    {
      id: "BN001",
      name: "Nguyễn Văn A",
      dob: "15/05/1980",
      gender: "Nam",
      phone: "0912345678",
      type: "Ngoại trú",
      department: "Khoa Nội",
      lastVisit: "20/12/2025",
      status: "Đang khám",
    },
    {
      id: "BN002",
      name: "Trần Thị B",
      dob: "22/08/1992",
      gender: "Nữ",
      phone: "0987654321",
      type: "Nội trú",
      department: "Khoa Sản",
      lastVisit: "18/12/2025",
      status: "Đang điều trị",
    },
    {
      id: "BN003",
      name: "Lê Văn C",
      dob: "10/03/1975",
      gender: "Nam",
      phone: "0923456789",
      type: "Ngoại trú",
      department: "Khoa Ngoại",
      lastVisit: "15/12/2025",
      status: "Hoàn thành",
    },
    {
      id: "BN004",
      name: "Phạm Thị D",
      dob: "05/11/1988",
      gender: "Nữ",
      phone: "0934567890",
      type: "Ngoại trú",
      department: "Khoa Nhi",
      lastVisit: "22/12/2025",
      status: "Chờ thanh toán",
    },
    {
      id: "BN005",
      name: "Hoàng Văn E",
      dob: "18/07/1965",
      gender: "Nam",
      phone: "0945678901",
      type: "Nội trú",
      department: "Khoa Tim mạch",
      lastVisit: "10/12/2025",
      status: "Đang điều trị",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang khám":
        return "blue";
      case "Đang điều trị":
        return "purple";
      case "Chờ thanh toán":
        return "orange";
      case "Hoàn thành":
        return "green";
      default:
        return "gray";
    }
  };

  const getTypeColor = (type) => {
    return type === "Nội trú" ? "purple" : "cyan";
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);

    const matchesStatus = filterStatus === "all" || patient.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || patient.department === filterDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          bg="white"
          borderColor="gray.300"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đang khám">Đang khám</option>
          <option value="Đang điều trị">Đang điều trị</option>
          <option value="Chờ thanh toán">Chờ thanh toán</option>
          <option value="Hoàn thành">Hoàn thành</option>
        </Select>

        <Select
          maxW="200px"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          bg="white"
          borderColor="gray.300"
        >
          <option value="all">Tất cả khoa</option>
          <option value="Khoa Nội">Khoa Nội</option>
          <option value="Khoa Ngoại">Khoa Ngoại</option>
          <option value="Khoa Sản">Khoa Sản</option>
          <option value="Khoa Nhi">Khoa Nhi</option>
          <option value="Khoa Tim mạch">Khoa Tim mạch</option>
        </Select>
      </Flex>

      {/* Patient Table */}
      <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden" border="1px solid" borderColor="gray.200">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Mã BN</Th>
              <Th>Họ tên</Th>
              <Th>Ngày sinh</Th>
              <Th>Giới tính</Th>
              <Th>SĐT</Th>
              <Th>Loại</Th>
              <Th>Khoa</Th>
              <Th>Lần khám cuối</Th>
              <Th>Trạng thái</Th>
              <Th>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <Tr key={patient.id} _hover={{ bg: "gray.50" }}>
                  <Td fontWeight="bold" color="teal.600">
                    {patient.id}
                  </Td>
                  <Td fontWeight="semibold">{patient.name}</Td>
                  <Td>{patient.dob}</Td>
                  <Td>{patient.gender}</Td>
                  <Td>{patient.phone}</Td>
                  <Td>
                    <Badge colorScheme={getTypeColor(patient.type)}>{patient.type}</Badge>
                  </Td>
                  <Td>{patient.department}</Td>
                  <Td>{patient.lastVisit}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(patient.status)} px={2} py={1} borderRadius="md">
                      {patient.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button size="sm" colorScheme="teal" leftIcon={<MdVisibility />}>
                        Xem
                      </Button>
                      <Button size="sm" colorScheme="blue" variant="outline" leftIcon={<MdHistory />}>
                        Lịch sử
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
