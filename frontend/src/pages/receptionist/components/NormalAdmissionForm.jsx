import { Box, VStack, HStack, Heading, Divider, SimpleGrid, FormControl, FormLabel, Select, Input, Textarea, Button, Icon, Flex } from "@chakra-ui/react";
import { MdBed } from "react-icons/md";

const NormalAdmissionForm = ({
  departments,
  rooms,
  beds,
  selectedDepartment,
  setSelectedDepartment,
  selectedRoom,
  setSelectedRoom,
  diagnosis,
  onCancel,
  onAdmit
}) => (
  <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} border="1px solid" borderColor="gray.200">
    <VStack spacing={6} align="stretch">
      <HStack>
        <Icon as={MdBed} boxSize={6} color="teal.500" />
        <Heading size="md" color="teal.600">Phân giường</Heading>
      </HStack>
      <Divider />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <FormControl isRequired>
          <FormLabel fontWeight="semibold">Khoa điều trị</FormLabel>
          <Select
            placeholder="-- Chọn khoa --"
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedRoom("");
            }}
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontWeight="semibold">Phòng</FormLabel>
          <Select
            placeholder="-- Chọn phòng --"
            isDisabled={!selectedDepartment}
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {selectedDepartment &&
              rooms[selectedDepartment]?.map((room, idx) => (
                <option key={idx} value={room}>{room}</option>
              ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontWeight="semibold">Giường</FormLabel>
          <Select placeholder="-- Chọn giường --" isDisabled={!selectedRoom}>
            {selectedRoom &&
              beds[selectedRoom]?.map((bed, idx) => (
                <option key={idx} value={bed}>
                  {bed} {idx % 2 === 0 ? "(Trống)" : "(Đã sử dụng)"}
                </option>
              ))}
          </Select>
        </FormControl>
      </SimpleGrid>
      <Divider />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <FormControl isRequired>
          <FormLabel fontWeight="semibold">Thời gian nhập viện</FormLabel>
          <Input type="datetime-local" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontWeight="semibold">Loại nhập viện</FormLabel>
          <Select placeholder="-- Chọn loại --">
            <option>Nhập viện điều trị</option>
            <option>Nhập viện phẫu thuật</option>
            <option>Nhập viện cấp cứu</option>
            <option>Nhập viện theo yêu cầu</option>
          </Select>
        </FormControl>
      </SimpleGrid>
      <FormControl>
        <FormLabel fontWeight="semibold">Lý do nhập viện</FormLabel>
        <Textarea
          placeholder="Nhập lý do nhập viện..."
          defaultValue={diagnosis}
          minH="100px"
        />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="semibold">Ghi chú</FormLabel>
        <Textarea placeholder="Nhập ghi chú thêm..." minH="80px" />
      </FormControl>
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

export default NormalAdmissionForm;
