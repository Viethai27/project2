import { useState, useEffect } from "react";
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
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { MdSearch, MdVisibility, MdDescription } from "react-icons/md";
import { doctorAPI } from "../../services/api";

const PatientList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await doctorAPI.getPatients();
        if (response.data.success) {
          setPatients(response.data.data);
          setFilteredPatients(response.data.data);
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

  useEffect(() => {
    let filtered = patients;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone?.includes(searchTerm)
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((patient) => patient.type === filterType);
    }

    setFilteredPatients(filtered);
  }, [searchTerm, filterType, patients]);

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

  const getTypeColor = (type) => {
    switch (type) {
      case "Ngoại trú":
        return "blue";
      case "Nội trú":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Danh sách bệnh nhân
      </Heading>

      {isLoading ? (
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : (
        <>
          {/* Filters */}
          <Flex gap={4} mb={6} flexWrap="wrap">
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <Icon as={MdSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Tìm kiếm theo tên, SĐT..."
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
                  <Th>Họ tên</Th>
                  <Th>Tuổi</Th>
                  <Th>Giới tính</Th>
                  <Th>SĐT</Th>
                  <Th>Loại</Th>
                  <Th>Lần khám cuối</Th>
                  <Th>Số lịch hẹn</Th>
                  <Th>Thao tác</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <Tr key={patient._id} _hover={{ bg: "gray.50" }}>
                      <Td fontWeight="semibold">{patient.patientName}</Td>
                      <Td>{patient.age}</Td>
                      <Td>{patient.gender}</Td>
                      <Td>{patient.phone}</Td>
                      <Td>
                        <Badge colorScheme={getTypeColor(patient.type)}>
                          {patient.type}
                        </Badge>
                      </Td>
                      <Td>
                        {patient.lastVisit
                          ? new Date(patient.lastVisit).toLocaleDateString("vi-VN")
                          : "Chưa có"}
                      </Td>
                      <Td>
                        <Badge colorScheme="blue">{patient.appointmentCount}</Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            leftIcon={<Icon as={MdVisibility} />}
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => handleViewPatient(patient._id)}
                          >
                            Xem
                          </Button>
                          <Button
                            size="sm"
                            leftIcon={<Icon as={MdDescription} />}
                            colorScheme="green"
                            variant="outline"
                            onClick={() => handleViewMedicalRecord(patient._id)}
                          >
                            Bệnh án
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={8} textAlign="center" py={8}>
                      <Text color="gray.500">Không tìm thấy bệnh nhân</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Container>
  );
};

export default PatientList;
