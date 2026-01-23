import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Icon,
  VStack,
  HStack,
  Badge,
  Divider,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import {
  MdPeople,
  MdHourglassEmpty,
  MdLocalHospital,
  MdScience,
  MdCalendarToday,
} from "react-icons/md";
import { useState, useEffect } from "react";
import { doctorAPI } from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await doctorAPI.getDashboardStats();
        if (statsResponse.data.success) {
          const data = statsResponse.data.data;
          setStats([
            {
              title: "Bệnh nhân hôm nay",
              value: data.todayPatients.toString(),
              icon: MdPeople,
              color: "blue.500",
              bg: "blue.50",
            },
            {
              title: "Đang chờ khám",
              value: data.waitingPatients.toString(),
              icon: MdHourglassEmpty,
              color: "orange.500",
              bg: "orange.50",
            },
            {
              title: "Tổng bệnh nhân",
              value: data.totalPatients.toString(),
              icon: MdLocalHospital,
              color: "green.500",
              bg: "green.50",
            },
            {
              title: "Đã check-in hôm nay",
              value: data.checkedInToday.toString(),
              icon: MdScience,
              color: "purple.500",
              bg: "purple.50",
            },
          ]);
        }

        // Fetch upcoming appointments
        const appointmentsResponse = await doctorAPI.getUpcomingAppointments();
        if (appointmentsResponse.data.success) {
          setUpcomingAppointments(appointmentsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu dashboard",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Notifications (static for now)
  const notifications = [
    {
      id: 1,
      message: "Hệ thống đã được cập nhật",
      time: "5 phút trước",
      type: "info",
    },
    {
      id: 2,
      message: "Nhắc nhở: Cập nhật hồ sơ bệnh án định kỳ",
      time: "30 phút trước",
      type: "warning",
    },
  ];

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Dashboard
      </Heading>

      {isLoading ? (
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : (
        <>
          {/* Statistics Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            {stats.length > 0 ? stats.map((stat) => (
              <Box
                key={stat.title}
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {stat.title}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color={stat.color}>
                      {stat.value}
                    </Text>
                  </VStack>
                  <Box bg={stat.bg} p={3} borderRadius="lg">
                    <Icon as={stat.icon} boxSize={8} color={stat.color} />
                  </Box>
                </Flex>
              </Box>
            )) : (
              [
                { id: "stat-1", title: "Bệnh nhân hôm nay", value: "0", icon: MdPeople, color: "blue.500", bg: "blue.50" },
                { id: "stat-2", title: "Đang chờ khám", value: "0", icon: MdHourglassEmpty, color: "orange.500", bg: "orange.50" },
                { id: "stat-3", title: "Tổng bệnh nhân", value: "0", icon: MdLocalHospital, color: "green.500", bg: "green.50" },
                { id: "stat-4", title: "Đã check-in hôm nay", value: "0", icon: MdScience, color: "purple.500", bg: "purple.50" },
              ].map((stat) => (
                <Box
                  key={stat.id}
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Flex justify="space-between" align="center">
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        {stat.title}
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={stat.color}>
                        {stat.value}
                      </Text>
                    </VStack>
                    <Box bg={stat.bg} p={3} borderRadius="lg">
                      <Icon as={stat.icon} boxSize={8} color={stat.color} />
                    </Box>
                  </Flex>
                </Box>
              ))
            )}
          </SimpleGrid>

              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Upcoming Appointments */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
              <HStack mb={4}>
                <Icon as={MdCalendarToday} boxSize={6} color="blue.500" />
                <Heading size="md" color="gray.700">
                  Lịch khám sắp tới
                </Heading>
              </HStack>
              <VStack spacing={3} align="stretch">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <Box key={appointment._id}>
                      <Flex justify="space-between" align="center" py={2}>
                        <HStack spacing={3}>
                          <Text fontWeight="bold" color="blue.600" minW="60px">
                            {appointment.timeSlot}
                          </Text>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold">
                              {appointment.patientId?.userId?.fullName || "N/A"}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {appointment.reason || "Không có ghi chú"} -{" "}
                              {new Date(appointment.appointmentDate).toLocaleDateString("vi-VN")}
                            </Text>
                          </VStack>
                        </HStack>
                        <Badge
                          colorScheme={
                            appointment.status === "confirmed"
                              ? "green"
                              : appointment.status === "pending"
                              ? "orange"
                              : appointment.status === "checked_in"
                              ? "blue"
                              : "gray"
                          }
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {appointment.status === "confirmed"
                            ? "Đã xác nhận"
                            : appointment.status === "pending"
                            ? "Chờ xác nhận"
                            : appointment.status === "checked_in"
                            ? "Đã check-in"
                            : appointment.status}
                        </Badge>
                      </Flex>
                      <Divider />
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    Không có lịch khám sắp tới
                  </Text>
                )}
              </VStack>
            </Box>

            {/* Notifications */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
              <Heading size="md" mb={4} color="gray.700">
                Thông báo
              </Heading>
              <VStack spacing={3} align="stretch">
                {notifications.map((notification) => (
                  <Box key={notification.id} p={3} bg="gray.50" borderRadius="md" borderLeft="4px solid" borderColor={notification.type === "warning" ? "orange.400" : "blue.400"}>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      {notification.message}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {notification.time}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
