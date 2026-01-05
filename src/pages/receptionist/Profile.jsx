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
  SimpleGrid,
  Avatar,
  Flex,
  Icon,
  Divider,
  Badge,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { MdEdit, MdSave, MdLock, MdPerson, MdEmail, MdPhone, MdHistory } from "react-icons/md";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Fake receptionist profile data
  const [profile] = useState({
    id: "LT001",
    name: "Nguyễn Thị Mai",
    email: "nguyenthimai@pamec.vn",
    phone: "0987654321",
    position: "Lễ tân",
    department: "Phòng Tiếp nhận",
    startDate: "01/06/2020",
    shift: "Ca sáng",
    address: "456 Lê Văn Việt, Q.9, TP.HCM",
  });

  // Activity log
  const activityLog = [
    {
      id: 1,
      action: "Tiếp nhận bệnh nhân",
      patient: "BN001 - Nguyễn Văn A",
      time: "08:30 - 23/12/2025",
    },
    {
      id: 2,
      action: "Đăng ký khám",
      patient: "BN002 - Trần Thị B",
      time: "09:15 - 23/12/2025",
    },
    {
      id: 3,
      action: "Thanh toán",
      patient: "BN003 - Lê Văn C (HD012)",
      time: "10:00 - 23/12/2025",
    },
    {
      id: 4,
      action: "Nhập viện",
      patient: "BN004 - Phạm Thị D",
      time: "11:30 - 23/12/2025",
    },
    {
      id: 5,
      action: "Tiếp nhận bệnh nhân",
      patient: "BN005 - Hoàng Văn E",
      time: "13:45 - 23/12/2025",
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Hồ sơ cá nhân
      </Heading>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        {/* Profile Card */}
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          gridColumn={{ base: "1", lg: "1 / 2" }}
        >
          <VStack spacing={4}>
            <Avatar size="2xl" name={profile.name} bg="teal.500" color="white" />
            <VStack spacing={1}>
              <Heading size="md" color="teal.600">
                {profile.name}
              </Heading>
              <Text color="gray.600">{profile.position}</Text>
              <Badge colorScheme="teal" fontSize="md" px={3} py={1}>
                {profile.shift}
              </Badge>
            </VStack>

            <Divider />

            <VStack spacing={3} align="stretch" w="full">
              <HStack>
                <Icon as={MdPerson} color="gray.500" />
                <Text fontSize="sm" color="gray.600">
                  Mã NV: <Text as="span" fontWeight="semibold">{profile.id}</Text>
                </Text>
              </HStack>
              <HStack>
                <Icon as={MdEmail} color="gray.500" />
                <Text fontSize="sm" color="gray.600">
                  {profile.email}
                </Text>
              </HStack>
              <HStack>
                <Icon as={MdPhone} color="gray.500" />
                <Text fontSize="sm" color="gray.600">
                  {profile.phone}
                </Text>
              </HStack>
            </VStack>

            <Divider />

            <VStack spacing={2} align="stretch" w="full">
              <Text fontSize="sm" color="gray.600">
                <Text as="span" fontWeight="semibold">Phòng ban:</Text> {profile.department}
              </Text>
              <Text fontSize="sm" color="gray.600">
                <Text as="span" fontWeight="semibold">Ngày bắt đầu:</Text> {profile.startDate}
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Profile Details & Change Password */}
        <Box
          gridColumn={{ base: "1", lg: "2 / 4" }}
        >
          <VStack spacing={6} align="stretch">
            {/* Profile Details */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
              <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md" color="teal.600">
                  <Icon as={MdPerson} mr={2} />
                  Thông tin chi tiết
                </Heading>
                {!isEditing ? (
                  <Button colorScheme="teal" leftIcon={<MdEdit />} onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </Button>
                ) : (
                  <HStack>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                    <Button colorScheme="teal" leftIcon={<MdSave />} onClick={handleSave}>
                      Lưu
                    </Button>
                  </HStack>
                )}
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Họ và tên
                  </FormLabel>
                  <Input
                    value={profile.name}
                    isReadOnly={!isEditing}
                    bg={isEditing ? "white" : "gray.100"}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Email
                  </FormLabel>
                  <Input
                    value={profile.email}
                    isReadOnly={!isEditing}
                    bg={isEditing ? "white" : "gray.100"}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Số điện thoại
                  </FormLabel>
                  <Input
                    value={profile.phone}
                    isReadOnly={!isEditing}
                    bg={isEditing ? "white" : "gray.100"}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Phòng ban
                  </FormLabel>
                  <Input
                    value={profile.department}
                    isReadOnly
                    bg="gray.100"
                  />
                </FormControl>

                <FormControl gridColumn={{ base: "1", md: "1 / 3" }}>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Địa chỉ
                  </FormLabel>
                  <Input
                    value={profile.address}
                    isReadOnly={!isEditing}
                    bg={isEditing ? "white" : "gray.100"}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* Change Password */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
              <Heading size="md" color="teal.600" mb={4}>
                <Icon as={MdLock} mr={2} />
                Đổi mật khẩu
              </Heading>

              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Mật khẩu hiện tại
                  </FormLabel>
                  <Input type="password" placeholder="Nhập mật khẩu hiện tại" />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Mật khẩu mới
                  </FormLabel>
                  <Input type="password" placeholder="Nhập mật khẩu mới" />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Xác nhận mật khẩu mới
                  </FormLabel>
                  <Input type="password" placeholder="Nhập lại mật khẩu mới" />
                </FormControl>

                <Button colorScheme="teal" alignSelf="flex-start">
                  Đổi mật khẩu
                </Button>
              </VStack>
            </Box>

            {/* Activity Log */}
            <Box bg="white" borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
              <Box p={6} borderBottom="1px solid" borderColor="gray.200">
                <Heading size="md" color="teal.600">
                  <Icon as={MdHistory} mr={2} />
                  Lịch sử hoạt động
                </Heading>
              </Box>

              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Thao tác</Th>
                    <Th>Bệnh nhân</Th>
                    <Th>Thời gian</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {activityLog.map((log) => (
                    <Tr key={log.id} _hover={{ bg: "gray.50" }}>
                      <Td fontWeight="semibold">{log.action}</Td>
                      <Td>{log.patient}</Td>
                      <Td fontSize="sm" color="gray.600">{log.time}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Profile;
