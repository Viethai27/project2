import { useState, useRef } from "react";
import {
  Box,
  Text,
  Flex,
  Input,
  Textarea,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { MdCalendarMonth } from "react-icons/md";

const CustomerInfoForm = ({ onSubmit, selectedData, isLoading }) => {
  const [gender, setGender] = useState("male");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const dateInputRef = useRef(null);
  const toast = useToast();

  const handleSubmit = () => {
    // Validation for appointment details
    if (!selectedData?.department) {
      toast({
        title: "Vui lòng chọn chuyên khoa",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!selectedData?.doctor) {
      toast({
        title: "Vui lòng chọn bác sĩ",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validation for customer info
    if (!fullName.trim()) {
      toast({
        title: "Vui lòng nhập họ và tên",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!phone.trim()) {
      toast({
        title: "Vui lòng nhập số điện thoại",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!dateOfBirth) {
      toast({
        title: "Vui lòng chọn ngày sinh",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Vui lòng nhập lý do khám",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Prepare data
    const customerData = {
      fullName,
      gender,
      dateOfBirth,
      phone,
      email,
      reason,
    };

    onSubmit(customerData);
  };

  return (
    <Box>
      {/* TITLE */}
      <Box mb={10}>
        <Text fontSize="3xl" fontWeight="bold">
          Thông tin khách hàng
        </Text>
        <Box mt={2} w="260px" h="4px" bg="gray.400" />
      </Box>

      {/* ROW 1 */}
      <Flex gap={10} mb={8} flexWrap="wrap">
        {/* Họ và tên */}
        <Box flex="1" minW="300px">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="blue.700"
            mb={3}
          >
            Họ và tên
          </Text>

          <Flex align="center" gap={6}>
            <Input
              size="lg"
              placeholder="Nhập họ và tên"
              borderRadius="full"
              border="3px solid"
              borderColor="blue.300"
              bg="blue.50"
              _focus={{ borderColor: "blue.500" }}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {/* Gender */}
            <RadioGroup value={gender} onChange={setGender}>
              <Stack direction="row" spacing={6}>
                <Radio value="male" colorScheme="blue">
                  Nam
                </Radio>
                <Radio value="female" colorScheme="blue">
                  Nữ
                </Radio>
              </Stack>
            </RadioGroup>
          </Flex>
        </Box>

        {/* Ngày sinh */}
        <Box flex="1" minW="300px">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="blue.700"
            mb={3}
          >
            Ngày tháng năm sinh
          </Text>

          <Box position="relative">
            <Input
              ref={dateInputRef}
              size="lg"
              type="date"
              borderRadius="full"
              border="3px solid"
              borderColor="blue.300"
              bg="blue.50"
              pr={12}
              _focus={{ borderColor: "blue.500" }}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              sx={{
                "&::-webkit-calendar-picker-indicator": {
                  display: "none"
                }
              }}
            />
            <Icon
              as={MdCalendarMonth}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              color="blue.500"
              boxSize={6}
              cursor="pointer"
              onClick={() => dateInputRef.current?.showPicker()}
            />
          </Box>
        </Box>
      </Flex>

      {/* ROW 2 */}
      <Flex gap={10} mb={8} flexWrap="wrap">
        {/* Phone */}
        <Box flex="1" minW="300px">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="blue.700"
            mb={3}
          >
            Số điện thoại
          </Text>
          <Input
            size="lg"
            placeholder="Nhập số điện thoại"
            borderRadius="full"
            border="3px solid"
            borderColor="blue.300"
            bg="blue.50"
            _focus={{ borderColor: "blue.500" }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Box>

        {/* Email */}
        <Box flex="1" minW="300px">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="blue.700"
            mb={3}
          >
            Email
          </Text>
          <Input
            size="lg"
            placeholder="Nhập email"
            borderRadius="full"
            border="3px solid"
            borderColor="blue.300"
            bg="blue.50"
            _focus={{ borderColor: "blue.500" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
      </Flex>

      {/* Reason */}
      <Box mb={8}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="blue.700"
          mb={3}
        >
          Lý do khám
        </Text>
        <Textarea
          placeholder="Nhập lý do khám"
          minH="140px"
          resize="none"
          borderRadius="2xl"
          border="3px solid"
          borderColor="blue.300"
          bg="blue.50"
          _focus={{ borderColor: "blue.500" }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Box>

      {/* Submit Button */}
      <Flex justify="center" mt={6}>
        <Button
          size="lg"
          colorScheme="blue"
          bg="blue.600"
          _hover={{ bg: "blue.700" }}
          px={16}
          py={6}
          fontSize="xl"
          borderRadius="full"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Đang gửi..."
        >
          Đặt lịch khám
        </Button>
      </Flex>
    </Box>
  );
};

export default CustomerInfoForm;
