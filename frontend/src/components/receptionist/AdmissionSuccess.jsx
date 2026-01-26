import { Box, VStack, HStack, Icon, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const AdmissionSuccess = ({ onNewAdmission }) => (
  <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
    <VStack spacing={6} align="stretch">
      <HStack>
        <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
        <Heading size="md" color="green.600">Nhập viện thành công</Heading>
      </HStack>
      <Text>Bệnh nhân đã được nhập viện thành công.</Text>
      <Flex justify="flex-end" gap={3} pt={4}>
        <Button colorScheme="teal" onClick={onNewAdmission}>
          Nhập viện mới
        </Button>
      </Flex>
    </VStack>
  </Box>
);

export default AdmissionSuccess;
