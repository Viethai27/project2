import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Icon,
  IconButton,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  Textarea,
} from "@chakra-ui/react";
import { MdAdd, MdDelete, MdSave, MdPrint, MdMedication } from "react-icons/md";

const Prescription = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  // Fake prescription data
  const prescriptions = [
    {
      id: "TOA001",
      patientId: "BN001",
      patientName: "Nguyễn Văn A",
      date: "20/12/2025",
      diagnosis: "Cao huyết áp",
      itemCount: 3,
      status: "Đã kê",
    },
    {
      id: "TOA002",
      patientId: "BN002",
      patientName: "Trần Thị B",
      date: "19/12/2025",
      diagnosis: "Đái tháo đường",
      itemCount: 4,
      status: "Đã kê",
    },
    {
      id: "TOA003",
      patientId: "BN003",
      patientName: "Lê Văn C",
      date: "18/12/2025",
      diagnosis: "Viêm phổi",
      itemCount: 5,
      status: "Đã xuất thuốc",
    },
  ];

  const handleAddMedicine = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      {
        id: Date.now(),
        medicine: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: "",
        note: "",
      },
    ]);
  };

  const handleRemoveMedicine = (id) => {
    setPrescriptionItems(prescriptionItems.filter((item) => item.id !== id));
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Đơn thuốc
      </Heading>

      {/* Action Bar */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={4}>
          <Input placeholder="Tìm kiếm bệnh nhân..." maxW="300px" bg="white" borderColor="gray.300" />
          <Select maxW="200px" bg="white" borderColor="gray.300">
            <option value="all">Tất cả đơn thuốc</option>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
          </Select>
        </HStack>

        <Button colorScheme="blue" leftIcon={<MdAdd />} onClick={onOpen}>
          Kê đơn mới
        </Button>
      </Flex>

      {/* Prescription List */}
      <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden" border="1px solid" borderColor="gray.200">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Mã đơn</Th>
              <Th>Bệnh nhân</Th>
              <Th>Ngày kê</Th>
              <Th>Chẩn đoán</Th>
              <Th>Số thuốc</Th>
              <Th>Trạng thái</Th>
              <Th>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {prescriptions.map((prescription) => (
              <Tr key={prescription.id} _hover={{ bg: "gray.50" }}>
                <Td fontWeight="bold" color="blue.600">
                  {prescription.id}
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="semibold">{prescription.patientName}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {prescription.patientId}
                    </Text>
                  </VStack>
                </Td>
                <Td>{prescription.date}</Td>
                <Td>{prescription.diagnosis}</Td>
                <Td>
                  <Badge colorScheme="blue">{prescription.itemCount} thuốc</Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={prescription.status === "Đã xuất thuốc" ? "green" : "orange"}
                    px={2}
                    py={1}
                  >
                    {prescription.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="sm" colorScheme="blue">
                      Xem
                    </Button>
                    <IconButton
                      size="sm"
                      icon={<MdPrint />}
                      colorScheme="green"
                      aria-label="In đơn thuốc"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* New Prescription Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={MdMedication} color="blue.500" boxSize={6} />
              <Text>Kê đơn thuốc mới</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              {/* Patient Selection */}
              <Box>
                <Text fontWeight="bold" mb={2} color="blue.600">
                  Bệnh nhân
                </Text>
                <Select placeholder="-- Chọn bệnh nhân --">
                  <option>BN001 - Nguyễn Văn A</option>
                  <option>BN002 - Trần Thị B</option>
                  <option>BN003 - Lê Văn C</option>
                </Select>
              </Box>

              {/* Diagnosis */}
              <Box>
                <Text fontWeight="bold" mb={2} color="blue.600">
                  Chẩn đoán
                </Text>
                <Input placeholder="Nhập chẩn đoán..." />
              </Box>

              {/* Medicine List */}
              <Box>
                <Flex justify="space-between" align="center" mb={3}>
                  <Text fontWeight="bold" color="blue.600">
                    Danh sách thuốc
                  </Text>
                  <Button size="sm" colorScheme="blue" leftIcon={<MdAdd />} onClick={handleAddMedicine}>
                    Thêm thuốc
                  </Button>
                </Flex>

                {prescriptionItems.length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {prescriptionItems.map((item, index) => (
                      <Box key={item.id} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                        <Flex justify="space-between" align="start" mb={3}>
                          <Text fontWeight="bold" color="gray.700">
                            Thuốc {index + 1}
                          </Text>
                          <IconButton
                            size="sm"
                            icon={<MdDelete />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleRemoveMedicine(item.id)}
                            aria-label="Xóa thuốc"
                          />
                        </Flex>

                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                          <Box>
                            <Text fontSize="sm" mb={1}>
                              Tên thuốc
                            </Text>
                            <Select placeholder="-- Chọn thuốc --" size="sm">
                              <option>Paracetamol 500mg</option>
                              <option>Amoxicillin 500mg</option>
                              <option>Omeprazole 20mg</option>
                            </Select>
                          </Box>

                          <Box>
                            <Text fontSize="sm" mb={1}>
                              Liều dùng
                            </Text>
                            <Input placeholder="VD: 1 viên/lần" size="sm" />
                          </Box>

                          <Box>
                            <Text fontSize="sm" mb={1}>
                              Tần suất
                            </Text>
                            <Select size="sm">
                              <option>1 lần/ngày</option>
                              <option>2 lần/ngày</option>
                              <option>3 lần/ngày</option>
                              <option>4 lần/ngày</option>
                            </Select>
                          </Box>

                          <Box>
                            <Text fontSize="sm" mb={1}>
                              Thời gian (ngày)
                            </Text>
                            <NumberInput size="sm" min={1}>
                              <NumberInputField placeholder="7" />
                            </NumberInput>
                          </Box>

                          <Box>
                            <Text fontSize="sm" mb={1}>
                              Số lượng
                            </Text>
                            <NumberInput size="sm" min={1}>
                              <NumberInputField placeholder="14" />
                            </NumberInput>
                          </Box>

                          <Box>
                            <Text fontSize="sm" mb={1}>
                              Ghi chú
                            </Text>
                            <Input placeholder="Uống sau ăn" size="sm" />
                          </Box>
                        </SimpleGrid>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Box p={8} bg="gray.50" borderRadius="md" textAlign="center">
                    <Text color="gray.500">Chưa có thuốc nào. Nhấn "Thêm thuốc" để bắt đầu.</Text>
                  </Box>
                )}
              </Box>

              {/* Note */}
              <Box>
                <Text fontWeight="bold" mb={2} color="blue.600">
                  Lời dặn
                </Text>
                <Textarea placeholder="Nhập lời dặn cho bệnh nhân..." minH="100px" />
              </Box>

              {/* Actions */}
              <Flex justify="flex-end" gap={3}>
                <Button onClick={onClose}>Hủy</Button>
                <Button colorScheme="blue" leftIcon={<MdSave />}>
                  Lưu đơn thuốc
                </Button>
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Prescription;
