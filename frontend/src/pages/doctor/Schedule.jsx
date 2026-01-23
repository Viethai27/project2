import { useState, useEffect } from "react";
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
  Icon,
  SimpleGrid,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight, MdCalendarToday, MdAccessTime } from "react-icons/md";
import { doctorAPI } from "../../services/api";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await doctorAPI.getAppointmentsByDate(dateStr);
        
        if (response.data.success) {
          setScheduleData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải lịch làm việc',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDate, toast]);

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "green";
      case "Đang khám":
        return "blue";
      case "Chờ khám":
        return "orange";
      case "Đã hủy":
        return "red";
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

      {isLoading ? (
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Outpatient Schedule */}
          <Box>
            <Heading size="md" mb={4} color="blue.600">
              Lịch khám ngoại trú
            </Heading>
            <VStack spacing={4} align="stretch">
              {scheduleData.length > 0 ? (
                scheduleData.map((appointment) => (
                  <Box
                    key={appointment._id}
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
                          {appointment.timeSlot || appointment.time_slot}
                        </Text>
                      </HStack>
                      <Badge colorScheme={getStatusColor(appointment.status)} px={3} py={1} borderRadius="full">
                        {appointment.status === "confirmed"
                          ? "Đã xác nhận"
                          : appointment.status === "pending"
                          ? "Chờ xác nhận"
                          : appointment.status === "checked_in"
                          ? "Đã check-in"
                          : appointment.status === "cancelled"
                          ? "Đã hủy"
                          : appointment.status}
                      </Badge>
                    </Flex>
                    <VStack align="start" spacing={1} pl={6}>
                      <Text fontWeight="semibold" fontSize="lg">
                        {appointment.patientId?.userId?.fullName || "N/A"}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        SĐT: {appointment.patientId?.userId?.phone || "N/A"} • {appointment.reason || "Khám tổng quát"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {appointment.departmentId?.name || "Chưa có thông tin"}
                      </Text>
                    </VStack>
                  </Box>
                ))
              ) : (
                <Box bg="white" p={8} borderRadius="lg" textAlign="center">
                  <Text color="gray.500">Không có lịch khám nào trong ngày này</Text>
                </Box>
              )}
            </VStack>
          </Box>

          {/* Inpatient Rounds */}
          <Box>
            <Heading size="md" mb={4} color="green.600">
              Bệnh nhân nội trú theo dõi
            </Heading>
            <Box bg="white" p={8} borderRadius="lg" textAlign="center">
              <Text color="gray.500">Chức năng đang phát triển</Text>
            </Box>
          </Box>
        </SimpleGrid>
      )}
    </Container>
  );
};

export default Schedule;
