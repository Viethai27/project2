import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  Icon,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { MdNotifications, MdPerson, MdLogout, MdAccessTime } from "react-icons/md";

const Header = () => {
  return (
    <Box
      position="fixed"
      top={0}
      right={0}
      left="280px"
      h="70px"
      bg="white"
      boxShadow="sm"
      zIndex={999}
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <Flex h="full" px={6} align="center" justify="space-between">
        {/* Shift Info */}
        <HStack spacing={3}>
          <Icon as={MdAccessTime} boxSize={5} color="teal.500" />
          <Box>
            <Text fontSize="sm" color="gray.600">
              Ca trực
            </Text>
            <Text fontWeight="bold" color="teal.600">
              Ca sáng: 07:00 - 15:00
            </Text>
          </Box>
        </HStack>

        {/* Right Section */}
        <HStack spacing={4}>
          {/* Notifications */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdNotifications />}
              variant="ghost"
              colorScheme="teal"
              position="relative"
              aria-label="Thông báo"
            >
              <Badge
                position="absolute"
                top="0"
                right="0"
                colorScheme="red"
                borderRadius="full"
                fontSize="xs"
              >
                3
              </Badge>
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Box>
                  <Text fontWeight="semibold" fontSize="sm">
                    Bệnh nhân mới chờ tiếp nhận
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    5 phút trước
                  </Text>
                </Box>
              </MenuItem>
              <MenuItem>
                <Box>
                  <Text fontWeight="semibold" fontSize="sm">
                    Thanh toán chờ xử lý
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    10 phút trước
                  </Text>
                </Box>
              </MenuItem>
              <MenuItem>
                <Box>
                  <Text fontWeight="semibold" fontSize="sm">
                    Ca trực sắp kết thúc
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    1 giờ trước
                  </Text>
                </Box>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* User Menu */}
          <Menu>
            <MenuButton>
              <HStack spacing={3} cursor="pointer">
                <Box textAlign="right">
                  <Text fontWeight="bold" fontSize="sm">
                    Nguyễn Thị Mai
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Lễ tân
                  </Text>
                </Box>
                <Avatar size="sm" name="Nguyễn Thị Mai" bg="teal.400" />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<MdPerson />}>Hồ sơ cá nhân</MenuItem>
              <MenuDivider />
              <MenuItem icon={<MdLogout />} color="red.600">
                Đăng xuất
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
