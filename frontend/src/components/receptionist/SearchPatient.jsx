import { Box, VStack, HStack, Text, Input, Button, Divider, Icon } from "@chakra-ui/react";
import { MdSearch, MdLocalHospital } from "react-icons/md";

const SearchPatient = ({
  searchTerm,
  setSearchTerm,
  isSearching,
  handleSearch,
  onEmergencyClick
}) => (
  <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold" fontSize="lg" color="teal.600">
        Tìm kiếm bệnh nhân
      </Text>
      <HStack>
        <Input
          placeholder="Nhập mã BN / CCCD / SĐT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="lg"
        />
        <Button
          colorScheme="teal"
          leftIcon={<MdSearch />}
          size="lg"
          onClick={handleSearch}
          minW="150px"
          isLoading={isSearching}
          loadingText="Đang tìm..."
        >
          Tìm kiếm
        </Button>
      </HStack>
      <Divider />
      <Box bg="red.50" p={4} borderRadius="md" border="1px solid" borderColor="red.200">
        <VStack align="stretch" spacing={3}>
          <HStack>
            <Icon as={MdLocalHospital} color="red.600" boxSize={5} />
            <Text fontWeight="bold" color="red.700">
              Trường hợp cấp cứu
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.700">
            Nếu bệnh nhân đến trong tình trạng cấp cứu và không thể khai thác thông tin,
            vui lòng sử dụng chế độ nhập viện cấp cứu. Thông tin bệnh nhân có thể được cập nhật sau.
          </Text>
          <Button
            colorScheme="red"
            size="md"
            onClick={onEmergencyClick}
            leftIcon={<MdLocalHospital />}
          >
            Nhập viện cấp cứu - Không rõ danh tính
          </Button>
        </VStack>
      </Box>
    </VStack>
  </Box>
);

export default SearchPatient;
