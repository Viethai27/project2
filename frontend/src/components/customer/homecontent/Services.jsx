import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Icon, 
  Stack,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IoMdCall } from "react-icons/io";
import { MdCalendarMonth } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";

// Component con cho từng mục dịch vụ
const ServiceItem = ({ icon, title, description, isLast, onClick }) => {
  return (
    <Flex 
      align="center" 
      px={{ base: 4, md: 8 }} 
      py={4} 
      borderRight={isLast ? "none" : "1px solid #CDD1D4"} 
      flex={1}
      transition="all 0.2s"
      _hover={{ bg: "whiteAlpha.500", cursor: "pointer" }}
      onClick={onClick}
    >
      <Icon as={icon} boxSize={8} color="blue.500" mr={4} flexShrink={0} />
      <Stack spacing={0}>
        <Text fontWeight="bold" fontSize="lg" color="black">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500" fontWeight="medium" lineHeight="short">
          {description}
        </Text>
      </Stack>
    </Flex>
  );
};

const ServiceBanner = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCallHotline = () => {
    onOpen();
  };

  const handleBookAppointment = () => {
    navigate('/appointment');
  };

  return (
    <>
      <Container maxW="70%" py={4} ml={20} mb={10} position="absolute" transform="translateY(-120px)" zIndex={10}>
        <Box 
          bg="#E2F6FF"
          borderRadius="40px" 
          overflow="hidden"
          border="1px solid"
          borderColor="#CDD1D4"
          width="100%"
          boxShadow="lg"
        >
          <Flex direction={{ base: "column", md: "row" }} align="stretch">
            <ServiceItem 
              icon={IoMdCall} 
              title="Gọi tổng đài" 
              description="Tư vấn giải đáp các vấn đề của bạn" 
              onClick={handleCallHotline}
            />
            <ServiceItem 
              icon={MdCalendarMonth} 
              title="Đặt lịch hẹn" 
              description="Đặt lịch hẹn nhanh chóng, tiện lợi" 
              onClick={handleBookAppointment}
            />
            <ServiceItem 
              icon={FaUserDoctor} 
              title="Tìm bác sĩ" 
              description="Tìm thông tin chuyên gia PAMEC nhanh chóng" 
              isLast={true}
            />
          </Flex>
        </Box>
      </Container>

      {/* Modal liên hệ tổng đài */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Liên hệ tổng đài</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" gap={4} py={4}>
              <Icon as={IoMdCall} boxSize={16} color="blue.500" />
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                19000081
              </Text>
              <Text fontSize="md" color="gray.600" textAlign="center">
                Tổng đài hỗ trợ 24/7
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ServiceBanner;