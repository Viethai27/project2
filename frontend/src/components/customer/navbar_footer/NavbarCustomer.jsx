import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Link,
  Button,
  Spacer,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { LogoPamec } from "../../../assets/logo_pamec";
import { logout, getCurrentUser } from "../../../services/authService";

const NavbarCustomer = () => {
  const navigate = useNavigate();
  const navHeight = "80px";
  const navOffset = "12px";
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const navLinks = [
    { name: "Về PAMEC", href: "#" },
    { name: "Chuyên khoa", href: "#" },
    { name: "Tìm bác sĩ", href: "#" },
    { name: "Trang sức khỏe", href: "#" },
    { name: "Hướng dẫn khách hàng", href: "#" },
  ];

  return (
    <>
      {/* spacer transparent */}
      <Box
        height={`calc(${navHeight} + ${navOffset})`}
        width="100%"
        bg="transparent"
        pointerEvents="none"
      />
      <Flex
        as="nav"
        position="fixed"
        top={navOffset}
        left="4%"
        right="4%"
        maxW="1200px"
        margin="0 auto"
        zIndex={9999}
        bg="rgba(219, 233, 253, 0.61)"
        align="center"
        justify="space-between"
        height={navHeight}
        borderRadius="30px"
        filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))"
        px={6}
        backdropFilter="saturate(180%) blur(6px)"
      >
        {/* Logo - stack vertically */}
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          gap={1}
          cursor="pointer"
          onClick={() => navigate('/')}
          _hover={{ opacity: 0.8 }}
        >
          <Box display="inline-flex" alignItems="center" boxSize="40px">
            <LogoPamec width="40px" height="40px" />
          </Box>
          <Box
            as="span"
            fontWeight="700"
            fontSize="sm"
            color="blue.600"
          >
            PAMEC
          </Box>
        </Box>

        {/* Navigation Links - centered */}
        <Flex align="center" gap={6} position="absolute" left="45%" transform="translateX(-50%)">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              fontSize="sm"
              fontWeight="500"
              color="gray.700"
              _hover={{ color: "blue.600", textDecoration: "none" }}
              whiteSpace="nowrap"
            >
              {link.name}
            </Link>
          ))}
        </Flex>

        {/* Action Buttons */}
        <Flex alignItems="center" gap={3} flexShrink={0}>
          <Button
            colorScheme="blue"
            size="md"
            borderRadius="full"
            px={6}
            fontWeight="600"
            onClick={() => navigate('/appointment')}
            cursor="pointer"
            flexShrink={0}
          >
            Đặt lịch khám
          </Button>
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                rightIcon={<IoChevronDown />}
                maxW="150px"
              >
                <Flex align="center" gap={2}>
                  <Avatar size="sm" name={user.username} />
                  <Text 
                    fontSize="sm" 
                    fontWeight="500"
                    isTruncated
                    maxW="80px"
                  >
                    {user.username}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate('/profile')}>
                  Thông tin cá nhân
                </MenuItem>
                <MenuItem onClick={() => navigate('/appointments')}>
                  Lịch hẹn của tôi
                </MenuItem>
                <MenuItem onClick={logout} color="red.500">
                  Đăng xuất
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link
              fontSize="sm"
              fontWeight="500"
              color="gray.700"
              _hover={{ color: "blue.600", textDecoration: "none" }}
              onClick={() => navigate('/login')}
              cursor="pointer"
            >
              Login
            </Link>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default NavbarCustomer;
