import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Flex,
  Icon,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from "@chakra-ui/react";
import {
  MdNotifications,
  MdInfo,
  MdWarning,
  MdError,
  MdCheckCircle,
  MdDelete,
} from "react-icons/md";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Bệnh nhân mới chờ tiếp nhận",
      message: "Bệnh nhân Nguyễn Văn A (BN001) đang chờ tại quầy tiếp nhận",
      type: "info",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      title: "Thanh toán chờ xử lý",
      message: "Hóa đơn HD012 cần được xử lý thanh toán gấp",
      type: "warning",
      time: "10 phút trước",
      read: false,
    },
    {
      id: 3,
      title: "Lỗi hệ thống",
      message: "Không thể kết nối đến máy in tại quầy 2",
      type: "error",
      time: "15 phút trước",
      read: false,
    },
    {
      id: 4,
      title: "Ca trực sắp kết thúc",
      message: "Ca trực sáng sẽ kết thúc sau 1 giờ. Vui lòng chuẩn bị bàn giao",
      type: "info",
      time: "1 giờ trước",
      read: true,
    },
    {
      id: 5,
      title: "Đăng ký khám thành công",
      message: "Đã tạo phiếu khám A015 cho bệnh nhân Trần Thị B",
      type: "success",
      time: "2 giờ trước",
      read: true,
    },
    {
      id: 6,
      title: "Cập nhật hệ thống",
      message: "Hệ thống sẽ bảo trì vào 23:00 tối nay",
      type: "warning",
      time: "3 giờ trước",
      read: true,
    },
  ]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "info":
        return MdInfo;
      case "warning":
        return MdWarning;
      case "error":
        return MdError;
      case "success":
        return MdCheckCircle;
      default:
        return MdNotifications;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "info":
        return "blue";
      case "warning":
        return "orange";
      case "error":
        return "red";
      case "success":
        return "green";
      default:
        return "gray";
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const NotificationItem = ({ notification }) => (
    <Box
      bg={notification.read ? "gray.50" : "white"}
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor={notification.read ? "gray.200" : `${getTypeColor(notification.type)}.200`}
      borderLeft="4px solid"
      borderLeftColor={`${getTypeColor(notification.type)}.400`}
      cursor="pointer"
      onClick={() => markAsRead(notification.id)}
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="start">
        <HStack spacing={3} flex="1">
          <Icon
            as={getTypeIcon(notification.type)}
            boxSize={6}
            color={`${getTypeColor(notification.type)}.500`}
          />
          <VStack align="start" spacing={1} flex="1">
            <HStack>
              <Text fontWeight="bold" fontSize="md">
                {notification.title}
              </Text>
              {!notification.read && (
                <Badge colorScheme="red" fontSize="xs">
                  Mới
                </Badge>
              )}
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {notification.message}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {notification.time}
            </Text>
          </VStack>
        </HStack>

        <IconButton
          size="sm"
          icon={<MdDelete />}
          variant="ghost"
          colorScheme="red"
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
          }}
          aria-label="Xóa thông báo"
        />
      </Flex>
    </Box>
  );

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack>
          <Icon as={MdNotifications} boxSize={8} color="teal.500" />
          <Heading size="xl" color="gray.700">
            Thông báo
          </Heading>
          {unreadCount > 0 && (
            <Badge colorScheme="red" fontSize="lg" px={3} py={1} borderRadius="full">
              {unreadCount}
            </Badge>
          )}
        </HStack>

        {unreadCount > 0 && (
          <Badge
            colorScheme="teal"
            fontSize="md"
            px={4}
            py={2}
            borderRadius="md"
            cursor="pointer"
            onClick={markAllAsRead}
            _hover={{ bg: "teal.100" }}
          >
            Đánh dấu tất cả đã đọc
          </Badge>
        )}
      </Flex>

      {/* Notifications Tabs */}
      <Box bg="white" borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
        <Tabs colorScheme="teal">
          <TabList>
            <Tab fontWeight="semibold">
              Tất cả ({notifications.length})
            </Tab>
            <Tab fontWeight="semibold">
              Chưa đọc ({unreadCount})
            </Tab>
            <Tab fontWeight="semibold">
              Đã đọc ({readNotifications.length})
            </Tab>
          </TabList>

          <TabPanels>
            {/* All Notifications */}
            <TabPanel>
              <VStack spacing={3} align="stretch">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <Box p={8} textAlign="center">
                    <Icon as={MdNotifications} boxSize={12} color="gray.300" mb={2} />
                    <Text color="gray.500">Không có thông báo</Text>
                  </Box>
                )}
              </VStack>
            </TabPanel>

            {/* Unread Notifications */}
            <TabPanel>
              <VStack spacing={3} align="stretch">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <Box p={8} textAlign="center">
                    <Icon as={MdCheckCircle} boxSize={12} color="green.300" mb={2} />
                    <Text color="gray.500">Không có thông báo chưa đọc</Text>
                  </Box>
                )}
              </VStack>
            </TabPanel>

            {/* Read Notifications */}
            <TabPanel>
              <VStack spacing={3} align="stretch">
                {readNotifications.length > 0 ? (
                  readNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <Box p={8} textAlign="center">
                    <Icon as={MdNotifications} boxSize={12} color="gray.300" mb={2} />
                    <Text color="gray.500">Không có thông báo đã đọc</Text>
                  </Box>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Notifications;
