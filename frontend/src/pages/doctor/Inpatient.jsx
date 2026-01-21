import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  SimpleGrid,
  Icon,
  Divider,
} from "@chakra-ui/react";
import {
  MdLocalHospital,
  MdBed,
  MdPerson,
  MdCalendarToday,
  MdNoteAdd,
  MdTransferWithinAStation,
  MdExitToApp,
} from "react-icons/md";

const Inpatient = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fake inpatient data - Khoa Sản
  const inpatients = [
    {
      id: "BN005",
      name: "Hoàng Thị Thu",
      age: 32,
      gender: "Nữ",
      room: "Phòng Hậu Sản",
      bed: "Giường 3",
      admissionDate: "23/12/2025",
      diagnosis: "Sau sinh thường 2 tuần",
      status: "Hồi phục tốt",
      daysInHospital: 2,
    },
    {
      id: "BN007",
      name: "Đỗ Thị Ngọc",
      age: 34,
      gender: "Nữ",
      room: "Phòng Thai Sản",
      bed: "Giường 5",
      admissionDate: "21/12/2025",
      diagnosis: "Thai 32 tuần - Ngôi ngược",
      status: "Theo dõi trước mổ",
      daysInHospital: 4,
    },
    {
      id: "BN002",
      name: "Trần Thị Hương",
      age: 35,
      gender: "Nữ",
      room: "Phòng Thai Nguy Cơ Cao",
      bed: "Giường 2",
      admissionDate: "18/12/2025",
      diagnosis: "Thai 28 tuần - Tiền sản giật",
      status: "Đang điều trị",
      daysInHospital: 7,
    },
  ];

  // Fake daily records - Khoa Sản
  const dailyRecords = [
    {
      id: 1,
      date: "25/12/2025",
      time: "08:00",
      note: "Sản phụ tỉnh táo, ăn uống tốt. Vết mổ khô, không sưng đỏ",
      vitalSigns: "HA: 115/75, Mạch: 72, Nhiệt độ: 36.5°C",
      treatment: "Tiếp tục kháng sinh dự phòng, chăm sóc vết mổ",
    },
    {
      id: 2,
      date: "24/12/2025",
      time: "08:00",
      note: "Sản phụ tự chăm sóc được, di chuyển nhẹ nhàng",
      vitalSigns: "HA: 118/78, Mạch: 75, Nhiệt độ: 36.8°C",
      treatment: "Theo dõi dấu hiệu sinh tồn, hỗ trợ cho bú",
    },
  ];

  return (
    <Container maxW="7xl" py={6}>
      {/* Page Title */}
      <Heading size="xl" mb={6} color="gray.700">
        Nội trú
      </Heading>

      {/* Search and Filter */}
      <Flex gap={4} mb={6} flexWrap="wrap">
        <Input placeholder="Tìm kiếm bệnh nhân..." maxW="300px" bg="white" borderColor="gray.300" />
        <Select maxW="200px" bg="white" borderColor="gray.300">
          <option value="all">Tất cả phòng</option>
          <option value="201">Phòng 201</option>
          <option value="203">Phòng 203</option>
          <option value="205">Phòng 205</option>
        </Select>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 5 }} spacing={6}>
        {/* Patient List */}
        <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
          <Heading size="md" mb={4} color="blue.600">
            Danh sách bệnh nhân nội trú
          </Heading>
          <VStack spacing={3} align="stretch">
            {inpatients.map((patient) => (
              <Box
                key={patient.id}
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="md"
                border="2px solid"
                borderColor={selectedPatient?.id === patient.id ? "blue.400" : "gray.200"}
                cursor="pointer"
                onClick={() => setSelectedPatient(patient)}
                _hover={{ borderColor: "blue.300", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="start" mb={2}>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">
                      {patient.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {patient.id} • {patient.age} tuổi • {patient.gender}
                    </Text>
                  </VStack>
                  <Badge colorScheme="green" px={2} py={1}>
                    {patient.status}
                  </Badge>
                </Flex>
                <HStack spacing={4} fontSize="sm" color="gray.600">
                  <HStack>
                    <Icon as={MdBed} />
                    <Text>
                      {patient.room} - {patient.bed}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={MdCalendarToday} />
                    <Text>{patient.daysInHospital} ngày</Text>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Patient Details */}
        <Box gridColumn={{ base: "1", lg: "3 / 6" }}>
          {selectedPatient ? (
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
              {/* Patient Header */}
              <Flex justify="space-between" align="start" mb={4}>
                <HStack spacing={3}>
                  <Icon as={MdPerson} boxSize={8} color="blue.500" />
                  <VStack align="start" spacing={0}>
                    <Heading size="md" color="blue.600">
                      {selectedPatient.name}
                    </Heading>
                    <Text color="gray.600">Mã BN: {selectedPatient.id}</Text>
                  </VStack>
                </HStack>
                <Badge colorScheme="green" px={3} py={2} fontSize="md">
                  {selectedPatient.status}
                </Badge>
              </Flex>

              <SimpleGrid columns={2} spacing={3} mb={6}>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Vị trí
                  </Text>
                  <Text fontWeight="semibold">
                    {selectedPatient.room} - {selectedPatient.bed}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Ngày nhập viện
                  </Text>
                  <Text fontWeight="semibold">{selectedPatient.admissionDate}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Chẩn đoán
                  </Text>
                  <Text fontWeight="semibold">{selectedPatient.diagnosis}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Số ngày điều trị
                  </Text>
                  <Text fontWeight="semibold">{selectedPatient.daysInHospital} ngày</Text>
                </Box>
              </SimpleGrid>

              <Divider mb={6} />

              {/* Tabs */}
              <Tabs colorScheme="blue">
                <TabList>
                  <Tab>
                    <Icon as={MdNoteAdd} mr={2} />
                    Theo dõi hàng ngày
                  </Tab>
                  <Tab>
                    <Icon as={MdTransferWithinAStation} mr={2} />
                    Chuyển giường/khoa
                  </Tab>
                  <Tab>
                    <Icon as={MdExitToApp} mr={2} />
                    Xuất viện
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Daily Records */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Button colorScheme="blue" leftIcon={<MdNoteAdd />} alignSelf="flex-end">
                        Thêm ghi chú mới
                      </Button>

                      {dailyRecords.map((record) => (
                        <Box key={record.id} p={4} bg="gray.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                          <HStack mb={2}>
                            <Icon as={MdCalendarToday} color="blue.500" />
                            <Text fontWeight="bold" color="blue.600">
                              {record.date} - {record.time}
                            </Text>
                          </HStack>
                          <VStack align="start" spacing={2} pl={6}>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                                Sinh hiệu:
                              </Text>
                              <Text fontSize="sm">{record.vitalSigns}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                                Ghi chú:
                              </Text>
                              <Text fontSize="sm">{record.note}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                                Điều trị:
                              </Text>
                              <Text fontSize="sm">{record.treatment}</Text>
                            </Box>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  </TabPanel>

                  {/* Transfer */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontWeight="bold" mb={2} color="blue.600">
                          Loại chuyển
                        </Text>
                        <Select>
                          <option>Chuyển giường</option>
                          <option>Chuyển phòng</option>
                          <option>Chuyển khoa</option>
                        </Select>
                      </Box>

                      <Box>
                        <Text fontWeight="bold" mb={2} color="blue.600">
                          Vị trí mới
                        </Text>
                        <Select placeholder="-- Chọn vị trí mới --">
                          <option>Phòng 201 - Giường 1</option>
                          <option>Phòng 202 - Giường 5</option>
                          <option>Phòng 203 - Giường 10</option>
                        </Select>
                      </Box>

                      <Box>
                        <Text fontWeight="bold" mb={2} color="blue.600">
                          Lý do chuyển
                        </Text>
                        <Textarea placeholder="Nhập lý do chuyển..." minH="100px" />
                      </Box>

                      <Button colorScheme="blue" leftIcon={<MdTransferWithinAStation />}>
                        Xác nhận chuyển
                      </Button>
                    </VStack>
                  </TabPanel>

                  {/* Discharge */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontWeight="bold" mb={2} color="blue.600">
                          Loại xuất viện
                        </Text>
                        <Select>
                          <option>Khỏi bệnh</option>
                          <option>Đỡ, tiếp tục điều trị ngoại trú</option>
                          <option>Chuyển viện</option>
                          <option>Tự ý về</option>
                        </Select>
                      </Box>

                      <Box>
                        <Text fontWeight="bold" mb={2} color="blue.600">
                          Tình trạng ra viện
                        </Text>
                        <Textarea placeholder="Mô tả tình trạng bệnh nhân khi ra viện..." minH="100px" />
                      </Box>

                      <Box>
                        <Text fontWeight="bold" mb={2} color="blue.600">
                          Hướng điều trị tiếp theo
                        </Text>
                        <Textarea placeholder="Nhập hướng điều trị..." minH="100px" />
                      </Box>

                      <Box>
                        <Text fontWeight="bold" mb={2} color="blue.600">
                          Ngày hẹn tái khám
                        </Text>
                        <Input type="date" />
                      </Box>

                      <Button colorScheme="green" leftIcon={<MdExitToApp />}>
                        Xác nhận xuất viện
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          ) : (
            <Box
              bg="white"
              p={12}
              borderRadius="lg"
              boxShadow="md"
              border="1px solid"
              borderColor="gray.200"
              textAlign="center"
            >
              <Icon as={MdLocalHospital} boxSize={16} color="gray.300" mb={4} />
              <Text color="gray.500" fontSize="lg">
                Chọn bệnh nhân để xem chi tiết
              </Text>
            </Box>
          )}
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Inpatient;
