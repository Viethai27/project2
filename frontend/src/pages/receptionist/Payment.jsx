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
  Flex,
  Icon,
  Divider,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import { MdSearch, MdPayment, MdPrint, MdCheckCircle } from "react-icons/md";
import paymentService from "../../services/paymentService";

const Payment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
      const result = await paymentService.getBill(searchTerm);
      
      if (result && result.bill) {
        setSelectedBill(result.bill);
        setPaymentSuccess(false);
        toast({
          title: "Tìm thấy hóa đơn",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Không tìm thấy hóa đơn",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSelectedBill(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedBill) return;

    try {
      setIsProcessing(true);
      
      const paymentData = {
        billId: selectedBill._id,
        amount: calculatePatientPayment(),
        paymentMethod: "cash", // Can be changed to support multiple methods
      };

      await paymentService.processPayment(paymentData);
      
      setPaymentSuccess(true);
      toast({
        title: "Thanh toán thành công",
        description: "Đã ghi nhận thanh toán cho bệnh nhân",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Thanh toán thất bại",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedBill) return 0;
    return selectedBill.items.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateInsuranceCoverage = () => {
    if (!selectedBill) return 0;
    return selectedBill.items.reduce((sum, item) => sum + item.insurance, 0);
  };

  const calculatePatientPayment = () => {
    return calculateTotal() - calculateInsuranceCoverage();
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Thanh toán
      </Heading>

      {/* Search Section */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <Text fontWeight="bold" fontSize="lg" color="teal.600">
            Tra cứu hóa đơn
          </Text>

          <HStack>
            <Input
              placeholder="Nhập mã hóa đơn / Mã bệnh nhân..."
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
        </VStack>
      </Box>

      {/* Bill Details */}
      {selectedBill && !paymentSuccess && (
        <>
          {/* Patient & Bill Info */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
            <HStack mb={4}>
              <Icon as={MdPayment} boxSize={6} color="teal.500" />
              <Heading size="md" color="teal.600">
                Thông tin hóa đơn
              </Heading>
              <Badge colorScheme="orange" px={3} py={1} ml="auto" fontSize="md">
                Chưa thanh toán
              </Badge>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Mã hóa đơn
                </Text>
                <Text fontWeight="bold">{selectedBill.billId}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Mã bệnh nhân
                </Text>
                <Text fontWeight="bold">{selectedBill.patientId}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Tên bệnh nhân
                </Text>
                <Text fontWeight="bold">{selectedBill.patientName}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Ngày lập
                </Text>
                <Text fontWeight="bold">{selectedBill.date}</Text>
              </Box>
              <Box gridColumn={{ base: "1", md: "1 / 5" }}>
                <Text fontSize="sm" color="gray.600">
                  Mã BHYT
                </Text>
                <HStack>
                  <Text fontWeight="bold">{selectedBill.insurance}</Text>
                  {selectedBill.hasInsurance && (
                    <Badge colorScheme="green">Có bảo hiểm</Badge>
                  )}
                </HStack>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Bill Items */}
          <Box bg="white" borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
            <Box p={6} borderBottom="1px solid" borderColor="gray.200">
              <Heading size="md" color="teal.600">
                Chi tiết chi phí
              </Heading>
            </Box>

            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Dịch vụ</Th>
                  <Th isNumeric>Đơn giá</Th>
                  <Th isNumeric>BHYT chi trả</Th>
                  <Th isNumeric>Bệnh nhân trả</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedBill.items.map((item, index) => (
                  <Tr key={index}>
                    <Td fontWeight="semibold">{item.name}</Td>
                    <Td isNumeric fontWeight="bold">
                      {item.price.toLocaleString("vi-VN")} đ
                    </Td>
                    <Td isNumeric color="green.600" fontWeight="semibold">
                      {item.insurance.toLocaleString("vi-VN")} đ
                    </Td>
                    <Td isNumeric color="orange.600" fontWeight="semibold">
                      {(item.price - item.insurance).toLocaleString("vi-VN")} đ
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Box p={6} bg="gray.50" borderTop="2px solid" borderColor="gray.300">
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Tổng chi phí
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                    {calculateTotal().toLocaleString("vi-VN")} đ
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    BHYT chi trả
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {calculateInsuranceCoverage().toLocaleString("vi-VN")} đ
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Bệnh nhân cần trả
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                    {calculatePatientPayment().toLocaleString("vi-VN")} đ
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </Box>

          {/* Payment Form */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
            <VStack spacing={6} align="stretch">
              <Heading size="md" color="teal.600">
                Thông tin thanh toán
              </Heading>

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Phương thức thanh toán</FormLabel>
                  <Select placeholder="-- Chọn phương thức --">
                    <option>Tiền mặt</option>
                    <option>Chuyển khoản</option>
                    <option>Thẻ ATM</option>
                    <option>Ví điện tử</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Số tiền thanh toán</FormLabel>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền"
                    defaultValue={calculatePatientPayment()}
                  />
                </FormControl>
              </SimpleGrid>

              <Flex justify="flex-end" gap={3} pt={4}>
                <Button variant="outline" size="lg">
                  Hủy
                </Button>
                <Button 
                  colorScheme="teal" 
                  size="lg" 
                  onClick={handlePayment}
                  isLoading={isProcessing}
                  loadingText="Đang xử lý..."
                >
                  Xác nhận thanh toán
                </Button>
              </Flex>
            </VStack>
          </Box>
        </>
      )}

      {/* Payment Success */}
      {paymentSuccess && (
        <Box
          bg="green.50"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          border="2px solid"
          borderColor="green.400"
          textAlign="center"
        >
          <Icon as={MdCheckCircle} boxSize={16} color="green.500" mb={4} />
          <Heading size="lg" color="green.700" mb={4}>
            Thanh toán thành công!
          </Heading>

          <VStack spacing={4} maxW="500px" mx="auto" mb={6}>
            <Box bg="white" p={4} borderRadius="md" w="full">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Mã giao dịch
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                TT{Date.now()}
              </Text>
            </Box>

            <SimpleGrid columns={2} spacing={4} w="full">
              <Box bg="white" p={4} borderRadius="md">
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Số tiền đã thanh toán
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="green.600">
                  {calculatePatientPayment().toLocaleString("vi-VN")} đ
                </Text>
              </Box>
              <Box bg="white" p={4} borderRadius="md">
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Thời gian
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  {new Date().toLocaleTimeString("vi-VN")}
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>

          <HStack justify="center" spacing={4}>
            <Button colorScheme="green" size="lg" leftIcon={<MdPrint />}>
              In hóa đơn
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              size="lg"
              onClick={() => {
                setPaymentSuccess(false);
                setSelectedBill(null);
                setSearchTerm("");
              }}
            >
              Thanh toán mới
            </Button>
          </HStack>
        </Box>
      )}
    </Container>
  );
};

export default Payment;
