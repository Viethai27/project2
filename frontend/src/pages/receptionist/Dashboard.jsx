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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  MdPeople,
  MdHourglassEmpty,
  MdPersonAdd,
  MdLocalHospital,
} from "react-icons/md";

const Dashboard = () => {
  // Statistics data
  const stats = [
    {
      title: "Tổng số bệnh nhân",
      subtitle: "Hôm nay",
      value: "87",
      icon: MdPeople,
      color: "teal.500",
      bg: "teal.50",
    },
    {
      title: "Chờ tiếp nhận",
      subtitle: "Đang xử lý",
      value: "12",
      icon: MdHourglassEmpty,
      color: "orange.500",
      bg: "orange.50",
    },
    {
      title: "Đăng ký mới",
      subtitle: "Hôm nay",
      value: "24",
      icon: MdPersonAdd,
      color: "blue.500",
      bg: "blue.50",
    },
    {
      title: "Nhập viện",
      subtitle: "Hôm nay",
      value: "6",
      icon: MdLocalHospital,
      color: "purple.500",
      bg: "purple.50",
    },
  ];

  // Waiting patients data
  const waitingPatients = [
    {
      id: 1,
      number: "A001",
      name: "Nguyễn Văn A",
      department: "Khoa Nội",
      status: "Chờ tiếp nhận",
      time: "08:30",
    },
    {
      id: 2,
      number: "A002",
      name: "Trần Thị B",
      department: "Khoa Ngoại",
      status: "Chờ tiếp nhận",
      time: "08:45",
    },
    {
      id: 3,
      number: "A003",
      name: "Lê Văn C",
      department: "Khoa Tai Mũi Họng",
      status: "Đang xử lý",
      time: "09:00",
    },
    {
      id: 4,
      number: "A004",
      name: "Phạm Thị D",
      department: "Khoa Nhi",
      status: "Chờ tiếp nhận",
      time: "09:15",
    },
    {
      id: 5,
      number: "A005",
      name: "Hoàng Văn E",
      department: "Khoa Mắt",
      status: "Chờ tiếp nhận",
      time: "09:30",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ tiếp nhận":
        return "orange";
      case "Đang xử lý":
        return "blue";
      case "Hoàn thành":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Dashboard Lễ Tân
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
                <Text fontSize="xs" color="gray.500">
                  {stat.subtitle}
                </Text>
              </VStack>
              <Box bg={stat.bg} p={3} borderRadius="lg">
                <Icon as={stat.icon} boxSize={8} color={stat.color} />
              </Box>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {/* Waiting Patients Table */}
      <Box bg="white" borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
        <Box p={6} borderBottom="1px solid" borderColor="gray.200">
          <Heading size="md" color="teal.600">
            Bệnh nhân đang chờ tiếp nhận
          </Heading>
        </Box>

        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>STT</Th>
              <Th>Họ tên</Th>
              <Th>Khoa</Th>
              <Th>Thời gian</Th>
              <Th>Trạng thái</Th>
            </Tr>
          </Thead>
          <Tbody>
            {waitingPatients.map((patient) => (
              <Tr key={patient.id} _hover={{ bg: "gray.50" }} cursor="pointer">
                <Td fontWeight="bold" color="teal.600">
                  {patient.number}
                </Td>
                <Td fontWeight="semibold">{patient.name}</Td>
                <Td>{patient.department}</Td>
                <Td>{patient.time}</Td>
                <Td>
                  <Badge
                    colorScheme={getStatusColor(patient.status)}
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {patient.status}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default Dashboard;
