import { Box, VStack, Text, Icon, Flex, Divider } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPersonAdd,
  MdCalendarToday,
  MdLocalHospital,
  MdPeople,
  MdPayment,
  MdNotifications,
  MdPerson,
  MdLogout,
} from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/receptionist/dashboard",
      icon: MdDashboard,
    },
    {
      name: "Tiếp nhận bệnh nhân",
      path: "/receptionist/patient-registration",
      icon: MdPersonAdd,
    },
    {
      name: "Đăng ký khám",
      path: "/receptionist/appointment-registration",
      icon: MdCalendarToday,
    },
    {
      name: "Nhập viện",
      path: "/receptionist/admission",
      icon: MdLocalHospital,
    },
    {
      name: "Danh sách bệnh nhân",
      path: "/receptionist/patients",
      icon: MdPeople,
    },
    {
      name: "Thanh toán",
      path: "/receptionist/payment",
      icon: MdPayment,
    },
    {
      name: "Thông báo",
      path: "/receptionist/notifications",
      icon: MdNotifications,
    },
    {
      name: "Hồ sơ cá nhân",
      path: "/receptionist/profile",
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
      {/* Logo/Brand */}
      <Box p={6} bg="teal.600" color="white">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          PAMEC
        </Text>
        <Text fontSize="sm" textAlign="center" opacity={0.9}>
          Lễ Tân
        </Text>
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
                bg={isActive ? "teal.50" : "transparent"}
                borderLeft={isActive ? "4px solid" : "4px solid transparent"}
                borderColor={isActive ? "teal.600" : "transparent"}
                color={isActive ? "teal.600" : "gray.700"}
                fontWeight={isActive ? "bold" : "normal"}
                _hover={{
                  bg: "teal.50",
                  color: "teal.600",
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
          onClick={handleLogout}
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
