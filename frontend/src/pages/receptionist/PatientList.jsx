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
  FormControl,
  FormLabel,
  Textarea,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { MdSearch, MdVisibility, MdHistory, MdEdit, MdWarning } from "react-icons/md";
import { patientAPI } from "../../services/api";

const PatientList = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
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

  // Function to fetch patients - can be called from other components
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
            // Kiểm tra xem có phải bệnh nhân cấp cứu chưa đầy đủ thông tin không
            const isEmergency = !patient.full_name || 
                               patient.full_name.includes("cấp cứu") || 
                               patient.full_name.includes("Chưa rõ danh tính") ||
                               patient.id_card === 'N/A' || 
                               patient.phone === 'N/A' ||
                               (!patient.id_card && !patient.address);
            
            const transformed = {
              _id: patient._id,
              id: patient.patientCode || patient._id.slice(-6).toUpperCase(),
              name: patient.full_name || patient.user?.username || "N/A",
              dob: patient.dob ? new Date(patient.dob).toLocaleDateString("vi-VN") : "N/A",
              gender: patient.gender === 'female' ? 'Nữ' : patient.gender === 'male' ? 'Nam' : 'Khác',
              phone: patient.user?.phone || patient.phone || "N/A",
              idCard: patient.id_card || "Chưa cập nhật",
              address: patient.address || "Chưa cập nhật",
              type: patient.admission_type || "Ngoại trú", // From admission data if available
              department: patient.department?.name || patient.department || "Chưa phân khoa", // Get from backend
              lastVisit: patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString("vi-VN") : "N/A",
              status: patient.status || "Hoàn thành", // Get from backend
              isEmergency: isEmergency, // Đánh dấu bệnh nhân cấp cứu
              rawData: patient, // Lưu data gốc để update
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

  // Auto-refresh when component mounts
  useEffect(() => {
    fetchPatients();
    
    // Also refresh when window regains focus (user returns from another page)
    const handleFocus = () => {
      console.log("Page focused, refreshing patient list...");
      fetchPatients();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleOpenUpdateForm = (patient) => {
    setSelectedPatient(patient);
    setUpdateFormData({
      fullName: patient.name === "N/A" ? "" : patient.name,
      dob: "",
      gender: patient.gender === "Nữ" ? "female" : patient.gender === "Nam" ? "male" : "other",
      idCard: patient.idCard === "Chưa cập nhật" ? "" : patient.idCard,
      phone: patient.phone === "N/A" ? "" : patient.phone,
      email: "",
      address: patient.address === "Chưa cập nhật" ? "" : patient.address,
    });
    setShowUpdateForm(true);
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
      
      // Cập nhật thông tin bệnh nhân
      const patientData = {
        full_name: updateFormData.fullName,
        dob: updateFormData.dob,
        gender: updateFormData.gender,
        id_card: updateFormData.idCard,
        phone: updateFormData.phone,
        email: updateFormData.email,
        address: updateFormData.address,
      };
      
      const response = await patientAPI.update(selectedPatient._id, patientData);
      
      if (response.data.success) {
        // Cập nhật lại danh sách
        const updatedPatients = patients.map(p => {
          if (p._id === selectedPatient._id) {
            return {
              ...p,
              name: updateFormData.fullName,
              dob: updateFormData.dob ? new Date(updateFormData.dob).toLocaleDateString("vi-VN") : p.dob,
              gender: updateFormData.gender === 'female' ? 'Nữ' : updateFormData.gender === 'male' ? 'Nam' : 'Khác',
              phone: updateFormData.phone,
              idCard: updateFormData.idCard || "Chưa cập nhật",
              address: updateFormData.address || "Chưa cập nhật",
              isEmergency: false,
            };
          }
          return p;
        });
        
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setShowUpdateForm(false);
        
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
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật thông tin bệnh nhân",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
        <Box bg="white" borderRadius="lg" boxShadow="md" overflow="auto" border="1px solid" borderColor="gray.200" maxW="100%">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Mã BN</Th>
                <Th>Họ tên</Th>
                <Th>Ngày sinh</Th>
                <Th>Giới tính</Th>
                <Th>SĐT</Th>
                <Th>CCCD</Th>
                <Th>Địa chỉ</Th>
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
                <Tr key={patient._id} _hover={{ bg: "gray.50" }} bg={patient.isEmergency ? "orange.50" : "white"}>
                  <Td fontWeight="bold" color="teal.600">
                    <HStack>
                      <Text>{patient.id}</Text>
                      {patient.isEmergency && (
                        <Badge colorScheme="red" fontSize="xs">
                          <Icon as={MdWarning} boxSize={3} mr={1} />
                          CẤP CỨU
                        </Badge>
                      )}
                    </HStack>
                  </Td>
                  <Td fontWeight="semibold">
                    <VStack align="start" spacing={0}>
                      <Text>{patient.name}</Text>
                      {patient.isEmergency && (
                        <Text fontSize="xs" color="orange.600">
                          Chưa đầy đủ thông tin
                        </Text>
                      )}
                    </VStack>
                  </Td>
                  <Td>{patient.dob}</Td>
                  <Td>{patient.gender}</Td>
                  <Td>{patient.phone}</Td>
                  <Td>
                    <Text fontSize="sm" color={patient.idCard === "Chưa cập nhật" ? "gray.400" : "gray.700"}>
                      {patient.idCard}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color={patient.address === "Chưa cập nhật" ? "gray.400" : "gray.700"} maxW="200px" isTruncated>
                      {patient.address}
                    </Text>
                  </Td>
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
                      {patient.isEmergency ? (
                        <Button 
                          size="sm" 
                          colorScheme="orange" 
                          leftIcon={<MdEdit />}
                          onClick={() => handleOpenUpdateForm(patient)}
                        >
                          Cập nhật TT
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" colorScheme="teal" leftIcon={<MdVisibility />}>
                            Xem
                          </Button>
                          <Button size="sm" colorScheme="blue" variant="outline" leftIcon={<MdHistory />}>
                            Lịch sử
                          </Button>
                        </>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={12} textAlign="center" py={8}>
                  <Text color="gray.500">Không tìm thấy bệnh nhân</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        </Box>
      )}

      {/* Form cập nhật thông tin bệnh nhân cấp cứu */}
      {showUpdateForm && selectedPatient && (
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
                <VStack align="start" spacing={1}>
                  <Heading size="lg" color="teal.600">
                    Cập nhật thông tin bệnh nhân
                  </Heading>
                  <HStack>
                    <Badge colorScheme="red">CẤP CỨU</Badge>
                    <Text fontSize="sm" color="gray.600">Mã BN: {selectedPatient.id}</Text>
                  </HStack>
                </VStack>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpdateForm(false)}
                >
                  ✕
                </Button>
              </HStack>

              <Divider />

              <Box bg="orange.50" p={3} borderRadius="md" border="1px solid" borderColor="orange.200">
                <HStack>
                  <Icon as={MdWarning} color="orange.600" />
                  <Text fontSize="sm" color="orange.800">
                    <strong>Lưu ý:</strong> Đây là bệnh nhân cấp cứu chưa có thông tin đầy đủ. Vui lòng cập nhật để hoàn thiện hồ sơ.
                  </Text>
                </HStack>
              </Box>

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

export default PatientList;
