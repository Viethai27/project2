import { Box, HStack, Icon, Heading, Badge, SimpleGrid, Text } from "@chakra-ui/react";
import { MdLocalHospital } from "react-icons/md";

const PatientInfo = ({ patient }) => {
  if (!patient) return null;
  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
      <HStack mb={4} justify="space-between">
        <HStack>
          <Icon as={MdLocalHospital} boxSize={6} color="purple.500" />
          <Heading size="md" color="teal.600">
            Thông tin bệnh nhân
          </Heading>
        </HStack>
        {patient.isEmergencyCase && (
          <Badge colorScheme="red" fontSize="md" px={3} py={1}>
            CẤP CỨU - CHƯA RÕ DANH TÍNH
          </Badge>
        )}
      </HStack>
      {patient.isEmergencyCase && (
        <Box bg="orange.50" p={3} borderRadius="md" mb={4} border="1px solid" borderColor="orange.200">
          <Text fontSize="sm" color="orange.800">
            <strong>Lưu ý:</strong> Đây là bệnh nhân cấp cứu chưa rõ danh tính. Vui lòng cập nhật thông tin đầy đủ khi có thể.
          </Text>
        </Box>
      )}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Box>
          <Text fontSize="sm" color="gray.600">Mã bệnh nhân</Text>
          <Text fontWeight="bold">{patient.id}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600">Họ tên</Text>
          <Text fontWeight="bold">{patient.name}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600">Ngày sinh</Text>
          <Text fontWeight="bold">{patient.dob}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600">Giới tính</Text>
          <Text fontWeight="bold">{patient.gender}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600">Bác sĩ chỉ định</Text>
          <Text fontWeight="bold">{patient.doctor}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600">Chẩn đoán ban đầu</Text>
          <Text fontWeight="bold" color="red.600">{patient.diagnosis}</Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default PatientInfo;
