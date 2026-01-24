import { useState, useEffect } from "react";
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
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { MdSearch, MdVisibility, MdHistory } from "react-icons/md";
import { patientAPI } from "../../services/api";

const PatientList = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await patientAPI.getAll();
        console.log("Patients API Response:", response.data);
        
        if (response.data.success) {
          const patientsData = response.data.patients || response.data.data || [];
          console.log("Raw patients data:", patientsData);
          console.log("First patient:", patientsData[0]);
          
          // Transform data to match UI requirements
          const transformedPatients = patientsData.map(patient => {
            const transformed = {
              _id: patient._id,
              id: patient.patientCode || patient._id.slice(-6).toUpperCase(),
              name: patient.full_name || patient.user?.username || "N/A",
              dob: patient.dob ? new Date(patient.dob).toLocaleDateString("vi-VN") : "N/A",
              gender: patient.gender === 'female' ? 'Nữ' : patient.gender === 'male' ? 'Nam' : 'Khác',
              phone: patient.user?.phone || patient.phone || "N/A",
              type: "Ngoại trú", // Default, can be updated based on admission status
              department: "Khoa Sản", // Default
              lastVisit: patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString("vi-VN") : "N/A",
              status: "Hoàn thành", // Default status
            };
            console.log("Transformed patient:", transformed);
            return transformed;
          });
          
          console.log("All transformed patients:", transformedPatients);
          setPatients(transformedPatients);
          setFilteredPatients(transformedPatients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách bệnh nhân",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

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

  // Filter patients when search or filters change
  useEffect(() => {
    const filtered = patients.filter((patient) => {
      // Improved search logic - more precise matching
      let matchesSearch = true;
      
      if (searchTerm.trim()) {
        const search = searchTerm.trim().toLowerCase();
        const patientName = patient.name.toLowerCase();
        const patientId = patient.id.toLowerCase();
        const patientPhone = patient.phone;
        
        // Require at least 2 characters for search
        if (search.length < 2) {
          matchesSearch = false;
        } else {
          // For patient ID: exact match or starts with
          const idMatch = patientId === search || patientId.startsWith(search);
          
          // For phone: exact match or starts with
          const phoneMatch = patientPhone === search || patientPhone.startsWith(search);
          
          // For name: match complete words or starts with search term
          // Split name into words and check if any word starts with search term
          const nameWords = patientName.split(' ');
          const nameMatch = nameWords.some(word => word.startsWith(search)) || 
                           patientName.startsWith(search);
          
          matchesSearch = idMatch || phoneMatch || nameMatch;
        }
      }

      const matchesStatus = filterStatus === "all" || patient.status === filterStatus;
      const matchesDepartment = filterDepartment === "all" || patient.department === filterDepartment;

      return matchesSearch && matchesStatus && matchesDepartment;
    });

    setFilteredPatients(filtered);
  }, [searchTerm, filterStatus, filterDepartment, patients]);

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
            placeholder="Nhập tối thiểu 2 ký tự (tên, mã BN, SĐT)..."
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

      {isLoading ? (
        <Flex justify="center" align="center" py={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
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
                <Tr key={patient._id} _hover={{ bg: "gray.50" }}>
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
      )}
    </Container>
  );
};

export default PatientList;
