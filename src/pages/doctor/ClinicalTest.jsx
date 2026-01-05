import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Icon,
  Select,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { MdAdd, MdVisibility, MdCheckCircle, MdPending, MdScience } from "react-icons/md";

const ClinicalTest = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filter, setFilter] = useState("all");

  // Fake clinical test data
  const clinicalTests = [
    {
      id: "CLS001",
      patientId: "BN001",
      patientName: "Nguyễn Văn A",
      testType: "Xét nghiệm máu",
      testName: "Công thức máu",
      orderDate: "20/12/2025 09:30",
      status: "Có kết quả",
      doctor: "BS. Nguyễn Văn B",
    },
    {
      id: "CLS002",
      patientId: "BN002",
      patientName: "Trần Thị B",
      testType: "Chẩn đoán hình ảnh",
      testName: "X-quang phổi",
      orderDate: "20/12/2025 10:00",
      status: "Đang thực hiện",
      doctor: "BS. Nguyễn Văn B",
    },
    {
      id: "CLS003",
      patientId: "BN003",
      patientName: "Lê Văn C",
      testType: "Xét nghiệm máu",
      testName: "Sinh hóa máu",
      orderDate: "19/12/2025 14:20",
      status: "Có kết quả",
      doctor: "BS. Nguyễn Văn B",
    },
    {
      id: "CLS004",
      patientId: "BN004",
      patientName: "Phạm Thị D",
      testType: "Chẩn đoán hình ảnh",
      testName: "Siêu âm bụng",
      orderDate: "20/12/2025 11:15",
      status: "Chờ thực hiện",
      doctor: "BS. Nguyễn Văn B",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Có kết quả":
        return "green";
      case "Đang thực hiện":
        return "blue";
      case "Chờ thực hiện":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Có kết quả":
        return MdCheckCircle;
      case "Đang thực hiện":
      case "Chờ thực hiện":
        return MdPending;
      default:
        return MdScience;
    }
  };

  const filteredTests = clinicalTests.filter((test) => {
    if (filter === "all") return true;
    return test.status === filter;
  });

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Cận lâm sàng (CLS)
      </Heading>

      {/* Action Bar */}
      <Flex justify="space-between" align="center" mb={6} gap={4} flexWrap="wrap">
        <HStack spacing={4}>
          <Select
            maxW="250px"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            bg="white"
            borderColor="gray.300"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ thực hiện">Chờ thực hiện</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Có kết quả">Có kết quả</option>
          </Select>

          <Input
            placeholder="Tìm kiếm bệnh nhân..."
            maxW="300px"
            bg="white"
            borderColor="gray.300"
          />
        </HStack>

        <Button colorScheme="blue" leftIcon={<MdAdd />} onClick={onOpen}>
          Tạo chỉ định mới
        </Button>
      </Flex>

      {/* Clinical Tests Table */}
      <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden" border="1px solid" borderColor="gray.200">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Mã CLS</Th>
              <Th>Bệnh nhân</Th>
              <Th>Loại</Th>
              <Th>Tên xét nghiệm</Th>
              <Th>Ngày chỉ định</Th>
              <Th>Trạng thái</Th>
              <Th>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTests.map((test) => (
              <Tr key={test.id} _hover={{ bg: "gray.50" }}>
                <Td fontWeight="bold" color="blue.600">
                  {test.id}
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="semibold">{test.patientName}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {test.patientId}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Badge colorScheme="purple">{test.testType}</Badge>
                </Td>
                <Td>{test.testName}</Td>
                <Td fontSize="sm">{test.orderDate}</Td>
                <Td>
                  <HStack>
                    <Icon as={getStatusIcon(test.status)} color={`${getStatusColor(test.status)}.500`} />
                    <Badge colorScheme={getStatusColor(test.status)} px={2} py={1}>
                      {test.status}
                    </Badge>
                  </HStack>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<MdVisibility />}
                    isDisabled={test.status !== "Có kết quả"}
                  >
                    Xem kết quả
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* New Clinical Test Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo chỉ định CLS mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs colorScheme="blue">
              <TabList>
                <Tab>Xét nghiệm máu</Tab>
                <Tab>Chẩn đoán hình ảnh</Tab>
                <Tab>Xét nghiệm khác</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontWeight="bold" color="blue.600">
                      Chọn xét nghiệm máu:
                    </Text>
                    <Select placeholder="-- Chọn xét nghiệm --">
                      <option>Công thức máu</option>
                      <option>Sinh hóa máu</option>
                      <option>Đông máu</option>
                      <option>Nhóm máu</option>
                    </Select>
                    <Flex justify="flex-end" gap={3} mt={4}>
                      <Button onClick={onClose}>Hủy</Button>
                      <Button colorScheme="blue">Tạo chỉ định</Button>
                    </Flex>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontWeight="bold" color="blue.600">
                      Chọn chẩn đoán hình ảnh:
                    </Text>
                    <Select placeholder="-- Chọn chẩn đoán --">
                      <option>X-quang phổi</option>
                      <option>X-quang xương khớp</option>
                      <option>Siêu âm bụng</option>
                      <option>CT Scanner</option>
                      <option>MRI</option>
                    </Select>
                    <Flex justify="flex-end" gap={3} mt={4}>
                      <Button onClick={onClose}>Hủy</Button>
                      <Button colorScheme="blue">Tạo chỉ định</Button>
                    </Flex>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontWeight="bold" color="blue.600">
                      Chọn xét nghiệm khác:
                    </Text>
                    <Select placeholder="-- Chọn xét nghiệm --">
                      <option>Xét nghiệm nước tiểu</option>
                      <option>Xét nghiệm phân</option>
                      <option>Vi sinh</option>
                      <option>Giải phẫu bệnh</option>
                    </Select>
                    <Flex justify="flex-end" gap={3} mt={4}>
                      <Button onClick={onClose}>Hủy</Button>
                      <Button colorScheme="blue">Tạo chỉ định</Button>
                    </Flex>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ClinicalTest;
