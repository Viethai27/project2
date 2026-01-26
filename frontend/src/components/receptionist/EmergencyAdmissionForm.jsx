import { Box, VStack, Text, Flex, Button } from "@chakra-ui/react";

const EmergencyAdmissionForm = ({ onCancel, onAdmit }) => (
  <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" color="red.600">Bệnh nhân cấp cứu - Chưa rõ danh tính</Text>
      <Text>Thông tin khoa/phòng/giường có thể bổ sung sau.</Text>
      <Flex justify="flex-end" gap={3} pt={4}>
        <Button variant="outline" size="lg" onClick={onCancel}>
          Hủy
        </Button>
        <Button colorScheme="teal" size="lg" onClick={onAdmit}>
          Xác nhận nhập viện
        </Button>
      </Flex>
    </VStack>
  </Box>
);

export default EmergencyAdmissionForm;
