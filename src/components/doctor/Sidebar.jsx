import { Box, VStack, Text, Icon, Flex, Avatar, Divider } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdCalendarMonth,
  MdPeople,
  MdDescription,
  MdScience,
  MdMedication,
  MdLocalHospital,
  MdPerson,
  MdLogout,
} from "react-icons/md";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/doctor/dashboard",
      icon: MdDashboard,
    },
    {
      name: "Lịch làm việc",
      path: "/doctor/schedule",
      icon: MdCalendarMonth,
    },
    {
      name: "Danh sách bệnh nhân",
      path: "/doctor/patients",
      icon: MdPeople,
    },
    {
      name: "Bệnh án",
      path: "/doctor/medical-records",
      icon: MdDescription,
    },
    {
      name: "Cận lâm sàng",
      path: "/doctor/clinical-tests",
      icon: MdScience,
    },
    {
      name: "Đơn thuốc",
      path: "/doctor/prescriptions",
      icon: MdMedication,
    },
    {
      name: "Nội trú",
      path: "/doctor/inpatient",
      icon: MdLocalHospital,
    },
    {
      name: "Hồ sơ cá nhân",
      path: "/doctor/profile",
      icon: MdPerson,
    },
  ];

  return (
    <Box
      w="280px"
      h="100vh"
      bg="white"
      boxShadow="lg"
      position="fixed"
      left={0}
      top={0}
      overflowY="auto"
      zIndex={1000}
    >
      {/* Header */}
      <Box p={6} bg="blue.600" color="white">
        <Flex align="center" gap={3} mb={2}>
          <Avatar size="md" name="Bác sĩ" bg="blue.400" />
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Dr. Nguyễn Văn A
            </Text>
            <Text fontSize="sm" opacity={0.9}>
              Khoa Nội tổng quát
            </Text>
          </Box>
        </Flex>
      </Box>

      <Divider />

      {/* Menu Items */}
      <VStack spacing={0} align="stretch" py={4}>
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => (
              <Flex
                align="center"
                gap={3}
                px={6}
                py={3}
                cursor="pointer"
                bg={isActive ? "blue.50" : "transparent"}
                borderLeft={isActive ? "4px solid" : "4px solid transparent"}
                borderColor={isActive ? "blue.600" : "transparent"}
                color={isActive ? "blue.600" : "gray.700"}
                fontWeight={isActive ? "bold" : "normal"}
                _hover={{
                  bg: "blue.50",
                  color: "blue.600",
                }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} boxSize={5} />
                <Text fontSize="md">{item.name}</Text>
              </Flex>
            )}
          </NavLink>
        ))}

        <Divider my={2} />

        {/* Logout */}
        <Flex
          align="center"
          gap={3}
          px={6}
          py={3}
          cursor="pointer"
          color="red.600"
          _hover={{
            bg: "red.50",
          }}
          transition="all 0.2s"
        >
          <Icon as={MdLogout} boxSize={5} />
          <Text fontSize="md" fontWeight="medium">
            Đăng xuất
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Sidebar;
