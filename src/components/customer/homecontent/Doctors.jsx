import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Text, 
  Button, 
  Flex, 
  Image, 
  Stack,
  Icon
} from "@chakra-ui/react";
import { FaUserMd, FaArrowRight } from "react-icons/fa";

// Fake data - sẽ thay thế bằng data từ backend sau
const doctorsData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    image: "https://via.placeholder.com/150",
    position: "Bác sĩ",
    title: "Trưởng khoa",
    specialty: "Nội tiết",
    department: "Khoa Khám bệnh & Nội khoa",
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    image: "https://via.placeholder.com/150",
    position: "Bác sĩ",
    title: "Trưởng khoa",
    specialty: "Nội tiết",
    department: "Khoa Khám bệnh & Nội khoa",
  },
  {
    id: 3,
    name: "Nguyễn Văn A",
    image: "https://via.placeholder.com/150",
    position: "Bác sĩ",
    title: "Trưởng khoa",
    specialty: "Nội tiết",
    department: "Khoa Khám bệnh & Nội khoa",
  },
  {
    id: 4,
    name: "Nguyễn Văn A",
    image: "https://via.placeholder.com/150",
    position: "Bác sĩ",
    title: "Trưởng khoa",
    specialty: "Nội tiết",
    department: "Khoa Khám bệnh & Nội khoa",
  },
];

export default function Doctors() {
  return (
    <Box mt={24} px={{ base: 4, md: 8 }}>
      <Heading fontSize={{ base: "2xl", md: "3xl" }} color="#228CCF" mb={2}>
        Đội ngũ Bác sĩ / Chuyên gia
      </Heading>
      <Box h="4px" w={{ base: "180px", md: "240px" }} bg="#1F3B57" mb={10} borderRadius="full" />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {doctorsData.map((doctor) => (
          <Box
            key={doctor.id}
            bg="#a5d4f353"
            borderRadius="24px"
            p={6}
            boxShadow="md"
            position="relative"
            minH="280px"
          >
            <Flex gap={6} align="start">
              {/* Doctor Image */}
              <Box
                bg="gray.200"
                borderRadius="16px"
                overflow="hidden"
                flexShrink={0}
                w="150px"
                h="180px"
              >
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              </Box>

              {/* Doctor Info */}
              <Stack spacing={2} flex={1}>
                <Text fontWeight="bold" fontSize="2xl" color="black">
                  {doctor.name}
                </Text>
                
                <Flex align="center" gap={2}>
                  <Icon as={FaUserMd} boxSize={5} color="gray.700" />
                  <Text fontSize="md" color="black">{doctor.position}</Text>
                </Flex>

                <Text fontSize="md" color="black" pl={7}>
                  {doctor.title}
                </Text>

                <Text fontSize="md" color="black" pl={7}>
                  {doctor.specialty}
                </Text>

                <Text fontSize="md" color="black" pl={7}>
                  {doctor.department}
                </Text>
              </Stack>
            </Flex>

            {/* Appointment Button */}
            <Button
              leftIcon={<FaArrowRight />}
              colorScheme="blue"
              bg="#2B6CB0"
              color="white"
              borderRadius="full"
              px={6}
              py={5}
              position="absolute"
              bottom={6}
              left={6}
              _hover={{ bg: "#1e4e8c" }}
            >
              Đặt lịch hẹn
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
