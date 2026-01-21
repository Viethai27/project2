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
  Radio,
  RadioGroup,
  Stack,
  Flex,
  Icon,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { MdSearch, MdPersonAdd, MdSave } from "react-icons/md";
import patientService from "../../services/patientService";

const PatientRegistration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patientFound, setPatientFound] = useState(null);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [gender, setGender] = useState("male");
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    idCard: "",
    phone: "",
    address: "",
    email: "",
    emergencyContact: "",
    emergencyPhone: "",
  });
  
  const toast = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Vui lòng nhập thông tin tìm kiếm",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSearching(true);
      const result = await patientService.searchPatient(searchTerm);
      
      if (result && result.patient) {
        setPatientFound(result.patient);
        setFormData({
          fullName: result.patient.fullName || "",
          dateOfBirth: result.patient.dateOfBirth || "",
          idCard: result.patient.idCard || "",
          phone: result.patient.phone || "",
          address: result.patient.address || "",
          email: result.patient.email || "",
          emergencyContact: result.patient.emergencyContact || "",
          emergencyPhone: result.patient.emergencyPhone || "",
        });
        setGender(result.patient.gender || "male");
        setIsNewPatient(false);
        
        toast({
          title: "Tìm thấy bệnh nhân",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        setPatientFound(null);
        toast({
          title: "Không tìm thấy bệnh nhân",
          description: "Vui lòng tạo hồ sơ mới cho bệnh nhân",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi tìm kiếm",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateNew = () => {
    setIsNewPatient(true);
    setPatientFound(null);
    setFormData({
      fullName: "",
      dateOfBirth: "",
      idCard: "",
      phone: "",
      address: "",
      email: "",
      emergencyContact: "",
      emergencyPhone: "",
    });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast({
        title: "Vui lòng nhập đầy đủ thông tin bắt buộc",
        description: "Họ tên và số điện thoại là bắt buộc",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const patientData = {
        ...formData,
        gender,
      };

      if (patientFound) {
        // Update existing patient
        await patientService.updatePatient(patientFound._id, patientData);
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin bệnh nhân đã được cập nhật",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new patient
        const result = await patientService.createPatient(patientData);
        setPatientFound(result.patient);
        toast({
          title: "Tạo hồ sơ thành công",
          description: `Mã bệnh nhân: ${result.patient.patientId}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi lưu thông tin",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndRegister = async () => {
    await handleSave();
    // Navigate to appointment registration page
    toast({
      title: "Chuyển sang đăng ký khám",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Tiếp nhận bệnh nhân
      </Heading>

      {/* Search Section */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <Text fontWeight="bold" fontSize="lg" color="teal.600">
            Tìm kiếm bệnh nhân
          </Text>

          <HStack>
            <Input
              placeholder="Nhập CCCD / SĐT / Mã bệnh nhân..."
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
              isLoading={isSearching}
              loadingText="Đang tìm..."
            >
              Tìm kiếm
            </Button>
          </HStack>

          {!patientFound && !isNewPatient && searchTerm && (
            <Button
              colorScheme="blue"
              leftIcon={<MdPersonAdd />}
              onClick={handleCreateNew}
              alignSelf="flex-start"
            >
              Tạo bệnh nhân mới
            </Button>
          )}
        </VStack>
      </Box>

      {/* Patient Information Form */}
      {(patientFound || isNewPatient) && (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
          <VStack spacing={6} align="stretch">
            {/* Section Header */}
            <Flex justify="space-between" align="center">
              <HStack>
                <Icon as={MdPersonAdd} boxSize={6} color="teal.500" />
                <Heading size="md" color="teal.600">
                  {patientFound ? "Thông tin bệnh nhân" : "Tạo bệnh nhân mới"}
                </Heading>
              </HStack>
              {patientFound && (
                <Text fontWeight="bold" color="teal.600">
                  Mã BN: {patientFound.id}
                </Text>
              )}
            </Flex>

            <Divider />

            {/* Personal Information */}
            <Box>
              <Text fontWeight="bold" mb={4} color="gray.700" fontSize="lg">
                Thông tin cá nhân
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Họ và tên</FormLabel>
                  <Input
                    placeholder="Nhập họ tên"
                    defaultValue={patientFound?.name}
                    isReadOnly={!!patientFound}
                    bg={patientFound ? "gray.100" : "white"}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Ngày sinh</FormLabel>
                  <Input
                    type="date"
                    defaultValue={patientFound?.dob}
                    isReadOnly={!!patientFound}
                    bg={patientFound ? "gray.100" : "white"}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Giới tính</FormLabel>
                  <RadioGroup
                    value={patientFound?.gender === "Nam" ? "male" : gender}
                    onChange={setGender}
                    isDisabled={!!patientFound}
                  >
                    <Stack direction="row" spacing={6}>
                      <Radio value="male" colorScheme="teal">
                        Nam
                      </Radio>
                      <Radio value="female" colorScheme="teal">
                        Nữ
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">CCCD/CMND</FormLabel>
                  <Input
                    placeholder="Nhập số CCCD"
                    defaultValue={patientFound?.idCard}
                    isReadOnly={!!patientFound}
                    bg={patientFound ? "gray.100" : "white"}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Số điện thoại</FormLabel>
                  <Input
                    placeholder="Nhập số điện thoại"
                    defaultValue={patientFound?.phone}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold">Email</FormLabel>
                  <Input placeholder="Nhập email" type="email" />
                </FormControl>

                <FormControl isRequired gridColumn={{ base: "1", md: "1 / 3" }}>
                  <FormLabel fontWeight="semibold">Địa chỉ</FormLabel>
                  <Input
                    placeholder="Nhập địa chỉ"
                    defaultValue={patientFound?.address}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Contact Person */}
            <Box>
              <Text fontWeight="bold" mb={4} color="gray.700" fontSize="lg">
                Thông tin người liên hệ
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <FormControl>
                  <FormLabel fontWeight="semibold">Họ tên người liên hệ</FormLabel>
                  <Input placeholder="Nhập họ tên" />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold">Quan hệ</FormLabel>
                  <Select placeholder="Chọn quan hệ">
                    <option>Vợ/Chồng</option>
                    <option>Con</option>
                    <option>Bố/Mẹ</option>
                    <option>Anh/Chị/Em</option>
                    <option>Khác</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold">Số điện thoại</FormLabel>
                  <Input placeholder="Nhập số điện thoại" />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Insurance Information */}
            <Box>
              <Text fontWeight="bold" mb={4} color="gray.700" fontSize="lg">
                Thông tin bảo hiểm y tế
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel fontWeight="semibold">Mã thẻ BHYT</FormLabel>
                  <Input placeholder="Nhập mã thẻ BHYT" />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold">Ngày hết hạn</FormLabel>
                  <Input type="date" />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* Action Buttons */}
            <Flex justify="flex-end" gap={3} pt={4}>
              <Button variant="outline" size="lg">
                Hủy
              </Button>
              <Button colorScheme="gray" leftIcon={<MdSave />} onClick={handleSave} size="lg">
                Lưu
              </Button>
              <Button
                colorScheme="teal"
                leftIcon={<MdSave />}
                onClick={handleSaveAndRegister}
                size="lg"
              >
                Lưu & Đăng ký khám
              </Button>
            </Flex>
          </VStack>
        </Box>
      )}
    </Container>
  );
};

export default PatientRegistration;
