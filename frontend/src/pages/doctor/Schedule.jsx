import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Flex,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight, MdCalendarToday, MdAccessTime } from "react-icons/md";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fake schedule data - Khoa Sản
  const scheduleData = [
    {
      id: 1,
      time: "08:00 - 08:30",
      patientName: "Nguyễn Thị Mai Anh",
      patientId: "BN001",
      type: "Khám thai 12 tuần",
      status: "Hoàn thành",
      room: "Phòng Khám Sản",
    },
    {
      id: 2,
      time: "08:30 - 09:00",
      patientName: "Trần Thị Hương",
      patientId: "BN002",
      type: "Thai 28 tuần - Tiền sản giật",
      status: "Hoàn thành",
      room: "Phòng Khám Sản",
    },
    {
      id: 3,
      time: "09:00 - 09:30",
      patientName: "Lê Thị Phương",
      patientId: "BN003",
      type: "Thai 35 tuần - ĐTĐ thai kỳ",
      status: "Đang khám",
      room: "Phòng Khám Sản",
    },
    {
      id: 4,
      time: "09:30 - 10:00",
      patientName: "Phạm Thị Lan",
      patientId: "BN004",
      type: "Thai 20 tuần - Thai đôi",
      status: "Chờ khám",
      room: "Phòng Khám Sản",
    },
    {
      id: 5,
      time: "10:00 - 10:30",
      patientName: "Vũ Thị Hoa",
      patientId: "BN006",
      type: "Thai 8 tuần - Khám định kỳ",
      status: "Chờ khám",
      room: "Phòng Khám Sản",
    },
  ];

  // Inpatient rounds data - Khoa Sản
  const inpatientRounds = [
    {
      id: 1,
      patientName: "Hoàng Thị Thu",
      patientId: "BN005",
      room: "Giường 3 - Phòng Hậu Sản",
      diagnosis: "Sau sinh 2 tuần - Theo dõi",
      admissionDate: "23/12/2025",
      status: "Hồi phục tốt",
    },
    {
      id: 2,
      patientName: "Đỗ Thị Ngọc",
      patientId: "BN007",
      room: "Giường 5 - Phòng Thai Sản",
      diagnosis: "Thai 32 tuần - Ngôi ngược",
      admissionDate: "21/12/2025",
      status: "Theo dõi trước mổ",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "green";
      case "Đang khám":
        return "blue";
      case "Chờ khám":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Lịch làm việc
      </Heading>

      {/* Date Navigation */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        bg="white"
        p={4}
        borderRadius="lg"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
      >
        <Button
          leftIcon={<MdChevronLeft />}
          variant="outline"
          colorScheme="blue"
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 1);
            setSelectedDate(newDate);
          }}
        >
          Hôm qua
        </Button>
        <HStack spacing={2}>
          <Icon as={MdCalendarToday} boxSize={5} color="blue.500" />
          <Text fontSize="lg" fontWeight="bold" color="gray.700">
            {formatDate(selectedDate)}
          </Text>
        </HStack>
        <Button
          rightIcon={<MdChevronRight />}
          variant="outline"
          colorScheme="blue"
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 1);
            setSelectedDate(newDate);
          }}
        >
          Ngày mai
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Outpatient Schedule */}
        <Box>
          <Heading size="md" mb={4} color="blue.600">
            Lịch khám ngoại trú
          </Heading>
          <VStack spacing={4} align="stretch">
            {scheduleData.map((appointment) => (
              <Box
                key={appointment.id}
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ boxShadow: "lg", borderColor: "blue.300" }}
                cursor="pointer"
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="start" mb={2}>
                  <HStack spacing={2}>
                    <Icon as={MdAccessTime} color="blue.500" />
                    <Text fontWeight="bold" color="blue.600">
                      {appointment.time}
                    </Text>
                  </HStack>
                  <Badge colorScheme={getStatusColor(appointment.status)} px={3} py={1} borderRadius="full">
                    {appointment.status}
                  </Badge>
                </Flex>
                <VStack align="start" spacing={1} pl={6}>
                  <Text fontWeight="semibold" fontSize="lg">
                    {appointment.patientName}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Mã BN: {appointment.patientId} • {appointment.type}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {appointment.room}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Inpatient Rounds */}
        <Box>
          <Heading size="md" mb={4} color="green.600">
            Bệnh nhân nội trú theo dõi
          </Heading>
          <VStack spacing={4} align="stretch">
            {inpatientRounds.map((patient) => (
              <Box
                key={patient.id}
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ boxShadow: "lg", borderColor: "green.300" }}
                cursor="pointer"
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="start" mb={2}>
                  <Text fontWeight="bold" fontSize="lg" color="green.600">
                    {patient.patientName}
                  </Text>
                  <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                    {patient.status}
                  </Badge>
                </Flex>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.600">
                    Mã BN: {patient.patientId}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Vị trí: {patient.room}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Chẩn đoán: {patient.diagnosis}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Nhập viện: {patient.admissionDate}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Schedule;
