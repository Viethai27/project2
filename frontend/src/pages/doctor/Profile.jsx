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
} from "@chakra-ui/react";
import { MdEdit, MdSave, MdLock, MdPerson, MdEmail, MdPhone, MdBadge } from "react-icons/md";
import { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Fake doctor profile data
  const [profile, setProfile] = useState({
    id: "BS001",
    name: "BS. Nguyễn Thị Hồng Nhung",
    email: "nhung.nguyen@pamec.com",
    phone: "0901234567",
    specialization: "Sản khoa",
    degree: "Bác sĩ Chuyên khoa II",
    department: "Khoa Sản - Phụ khoa",
    licenseNumber: "BS-12345-HCM",
    startDate: "01/01/2015",
    address: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
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
            <Avatar size="2xl" name={profile.name} bg="blue.500" color="white" />
            <VStack spacing={1}>
              <Heading size="md" color="blue.600">
                {profile.name}
              </Heading>
              <Text color="gray.600">{profile.degree}</Text>
              <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                {profile.specialization}
              </Badge>
            </VStack>

            <Divider />

            <VStack spacing={3} align="stretch" w="full">
              <HStack>
                <Icon as={MdBadge} color="gray.500" />
                <Text fontSize="sm" color="gray.600">
                  Mã BS: <Text as="span" fontWeight="semibold">{profile.id}</Text>
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
                <Text as="span" fontWeight="semibold">Khoa:</Text> {profile.department}
              </Text>
              <Text fontSize="sm" color="gray.600">
                <Text as="span" fontWeight="semibold">Số chứng chỉ hành nghề:</Text> {profile.licenseNumber}
              </Text>
              <Text fontSize="sm" color="gray.600">
                <Text as="span" fontWeight="semibold">Ngày bắt đầu:</Text> {profile.startDate}
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Profile Details */}
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          gridColumn={{ base: "1", lg: "2 / 4" }}
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="md" color="blue.600">
              <Icon as={MdPerson} mr={2} />
              Thông tin chi tiết
            </Heading>
            {!isEditing ? (
              <Button colorScheme="blue" leftIcon={<MdEdit />} onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </Button>
            ) : (
              <HStack>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
                <Button colorScheme="blue" leftIcon={<MdSave />} onClick={handleSave}>
                  Lưu
                </Button>
              </HStack>
            )}
          </Flex>

          <VStack spacing={6} align="stretch">
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
                  Chuyên khoa
                </FormLabel>
                <Input
                  value={profile.specialization}
                  isReadOnly={!isEditing}
                  bg={isEditing ? "white" : "gray.100"}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" color="gray.700">
                  Trình độ
                </FormLabel>
                <Input
                  value={profile.degree}
                  isReadOnly={!isEditing}
                  bg={isEditing ? "white" : "gray.100"}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" color="gray.700">
                  Khoa
                </FormLabel>
                <Input
                  value={profile.department}
                  isReadOnly={!isEditing}
                  bg={isEditing ? "white" : "gray.100"}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" color="gray.700">
                  Số chứng chỉ hành nghề
                </FormLabel>
                <Input
                  value={profile.licenseNumber}
                  isReadOnly={!isEditing}
                  bg={isEditing ? "white" : "gray.100"}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" color="gray.700">
                  Ngày bắt đầu công tác
                </FormLabel>
                <Input
                  value={profile.startDate}
                  isReadOnly={!isEditing}
                  bg={isEditing ? "white" : "gray.100"}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontWeight="bold" color="gray.700">
                Địa chỉ
              </FormLabel>
              <Input
                value={profile.address}
                isReadOnly={!isEditing}
                bg={isEditing ? "white" : "gray.100"}
              />
            </FormControl>
          </VStack>

          <Divider my={6} />

          {/* Change Password Section */}
          <Box>
            <Heading size="md" color="blue.600" mb={4}>
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

              <Button colorScheme="blue" alignSelf="flex-start">
                Đổi mật khẩu
              </Button>
            </VStack>
          </Box>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Profile;
