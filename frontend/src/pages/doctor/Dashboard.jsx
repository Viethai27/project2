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
} from "@chakra-ui/react";
import {
  MdPeople,
  MdHourglassEmpty,
  MdLocalHospital,
  MdScience,
  MdCalendarToday,
} from "react-icons/md";

const Dashboard = () => {
  // Fake data for statistics
  const stats = [
    {
      title: "Bệnh nhân hôm nay",
      value: "28",
      icon: MdPeople,
      color: "blue.500",
      bg: "blue.50",
    },
    {
      title: "Đang chờ khám",
      value: "12",
      icon: MdHourglassEmpty,
      color: "orange.500",
      bg: "orange.50",
    },
    {
      title: "Bệnh nhân nội trú",
      value: "5",
      icon: MdLocalHospital,
      color: "green.500",
      bg: "green.50",
    },
    {
      title: "CLS chờ kết quả",
      value: "8",
      icon: MdScience,
      color: "purple.500",
      bg: "purple.50",
    },
  ];

  // Fake data for upcoming appointments - Khoa Sản
  const upcomingAppointments = [
    {
      id: 1,
      patientName: "Nguyễn Thị Mai Anh",
      time: "08:00",
      type: "Khám thai 12 tuần",
      status: "Chờ khám",
    },
    {
      id: 2,
      patientName: "Trần Thị Hương",
      time: "08:30",
      type: "Thai 28 tuần - Tiền sản giật",
      status: "Chờ khám",
    },
    {
      id: 3,
      patientName: "Lê Thị Phương",
      time: "09:00",
      type: "Thai 35 tuần - ĐTĐ thai kỳ",
      status: "Đang khám",
    },
    {
      id: 4,
      patientName: "Phạm Thị Lan",
      time: "09:30",
      type: "Thai 20 tuần - Thai đôi",
      status: "Chờ khám",
    },
  ];

  // Fake notifications - Khoa Sản
  const notifications = [
    {
      id: 1,
      message: "Kết quả siêu âm thai của BN Nguyễn Thị Mai Anh đã có",
      time: "5 phút trước",
      type: "info",
    },
    {
      id: 2,
      message: "BN Trần Thị Hương - Huyết áp tăng, cần theo dõi sát",
      time: "15 phút trước",
      type: "warning",
    },
    {
      id: 3,
      message: "BN Đỗ Thị Ngọc - Thai nhi đã xoay đầu, cần tái khám",
      time: "30 phút trước",
      type: "info",
    },
    {
      id: 4,
      message: "Kết quả NIPT của BN Bùi Thị Thanh sẽ có vào chiều nay",
      time: "1 giờ trước",
      type: "info",
    },
  ];

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Dashboard
      </Heading>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {stats.map((stat, index) => (
          <Box
            key={index}
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
        ))}
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
            {upcomingAppointments.map((appointment) => (
              <Box key={appointment.id}>
                <Flex justify="space-between" align="center" py={2}>
                  <HStack spacing={3}>
                    <Text fontWeight="bold" color="blue.600" minW="60px">
                      {appointment.time}
                    </Text>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold">{appointment.patientName}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {appointment.type}
                      </Text>
                    </VStack>
                  </HStack>
                  <Badge
                    colorScheme={appointment.status === "Đã đến" ? "green" : "orange"}
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {appointment.status}
                  </Badge>
                </Flex>
                <Divider />
              </Box>
            ))}
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
    </Container>
  );
};

export default Dashboard;
