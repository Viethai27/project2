import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  SimpleGrid,
  Divider,
  Badge,
  Select,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { MdPerson, MdSave, MdAdd } from "react-icons/md";

const MedicalRecord = () => {
  const [selectedPatient, setSelectedPatient] = useState({
    id: "BN001",
    name: "Nguyễn Văn A",
    age: 45,
    gender: "Nam",
    phone: "0912345678",
    address: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
    insurance: "DN4500123456789",
  });

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Bệnh án
      </Heading>

      {/* Patient Info Header */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
        <HStack spacing={4} mb={4}>
          <Icon as={MdPerson} boxSize={8} color="blue.500" />
          <VStack align="start" spacing={0}>
            <Heading size="md" color="blue.600">
              {selectedPatient.name}
            </Heading>
            <Text color="gray.600">Mã BN: {selectedPatient.id}</Text>
          </VStack>
          <Badge colorScheme="green" px={3} py={1} fontSize="md" ml="auto">
            Đang khám
          </Badge>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Tuổi / Giới tính
            </Text>
            <Text fontWeight="semibold">
              {selectedPatient.age} / {selectedPatient.gender}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Số điện thoại
            </Text>
            <Text fontWeight="semibold">{selectedPatient.phone}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Mã bảo hiểm
            </Text>
            <Text fontWeight="semibold">{selectedPatient.insurance}</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Medical Record Tabs */}
      <Box bg="white" borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
        <Tabs colorScheme="blue" variant="enclosed">
          <TabList>
            <Tab fontWeight="semibold">Khám lâm sàng</Tab>
            <Tab fontWeight="semibold">Sinh hiệu</Tab>
            <Tab fontWeight="semibold">Chẩn đoán</Tab>
            <Tab fontWeight="semibold">Cận lâm sàng</Tab>
            <Tab fontWeight="semibold">Đơn thuốc</Tab>
          </TabList>

          <TabPanels>
            {/* Clinical Examination */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2} color="blue.600">
                    Lý do khám
                  </Text>
                  <Textarea
                    placeholder="Nhập lý do khám..."
                    defaultValue="Đau đầu, chóng mặt kéo dài 3 ngày"
                    minH="100px"
                  />
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2} color="blue.600">
                    Tiền sử bệnh
                  </Text>
                  <Textarea
                    placeholder="Nhập tiền sử bệnh..."
                    defaultValue="Tiền sử cao huyết áp 2 năm"
                    minH="100px"
                  />
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2} color="blue.600">
                    Khám lâm sàng
                  </Text>
                  <Textarea placeholder="Nhập kết quả khám..." minH="150px" />
                </Box>

                <Flex justify="flex-end" gap={3}>
                  <Button colorScheme="gray">Hủy</Button>
                  <Button colorScheme="blue" leftIcon={<MdSave />}>
                    Lưu
                  </Button>
                </Flex>
              </VStack>
            </TabPanel>

            {/* Vital Signs */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="blue.600">
                      Nhiệt độ (°C)
                    </Text>
                    <Input type="number" placeholder="36.5" step="0.1" />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="blue.600">
                      Huyết áp (mmHg)
                    </Text>
                    <HStack>
                      <Input type="number" placeholder="120" />
                      <Text>/</Text>
                      <Input type="number" placeholder="80" />
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="blue.600">
                      Mạch (lần/phút)
                    </Text>
                    <Input type="number" placeholder="75" />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="blue.600">
                      Nhịp thở (lần/phút)
                    </Text>
                    <Input type="number" placeholder="18" />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="blue.600">
                      Cân nặng (kg)
                    </Text>
                    <Input type="number" placeholder="65" step="0.1" />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="blue.600">
                      Chiều cao (cm)
                    </Text>
                    <Input type="number" placeholder="170" />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="blue.600">
                      SpO2 (%)
                    </Text>
                    <Input type="number" placeholder="98" />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2} color="blue.600">
                      BMI
                    </Text>
                    <Input placeholder="Tự động tính" isReadOnly bg="gray.100" />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={3} mt={4}>
                  <Button colorScheme="gray">Hủy</Button>
                  <Button colorScheme="blue" leftIcon={<MdSave />}>
                    Lưu sinh hiệu
                  </Button>
                </Flex>
              </VStack>
            </TabPanel>

            {/* Diagnosis */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2} color="blue.600">
                    Chẩn đoán sơ bộ
                  </Text>
                  <Textarea placeholder="Nhập chẩn đoán sơ bộ..." minH="100px" />
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2} color="blue.600">
                    Chẩn đoán xác định
                  </Text>
                  <Textarea placeholder="Nhập chẩn đoán xác định..." minH="100px" />
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2} color="blue.600">
                    Mã ICD-10
                  </Text>
                  <Input placeholder="Tìm kiếm mã ICD-10..." />
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2} color="blue.600">
                    Ghi chú
                  </Text>
                  <Textarea placeholder="Ghi chú thêm..." minH="100px" />
                </Box>

                <Flex justify="flex-end" gap={3}>
                  <Button colorScheme="gray">Hủy</Button>
                  <Button colorScheme="blue" leftIcon={<MdSave />}>
                    Lưu chẩn đoán
                  </Button>
                </Flex>
              </VStack>
            </TabPanel>

            {/* Clinical Tests */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="blue.600" fontSize="lg">
                    Danh sách chỉ định CLS
                  </Text>
                  <Button colorScheme="blue" leftIcon={<MdAdd />}>
                    Thêm chỉ định
                  </Button>
                </Flex>

                <Divider />

                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text color="gray.600" textAlign="center">
                    Chưa có chỉ định CLS nào
                  </Text>
                </Box>
              </VStack>
            </TabPanel>

            {/* Prescription */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="blue.600" fontSize="lg">
                    Đơn thuốc
                  </Text>
                  <Button colorScheme="blue" leftIcon={<MdAdd />}>
                    Thêm thuốc
                  </Button>
                </Flex>

                <Divider />

                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text color="gray.600" textAlign="center">
                    Chưa có đơn thuốc
                  </Text>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default MedicalRecord;
