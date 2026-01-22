import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  Select,
  Icon,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { MdCalendarMonth } from "react-icons/md";
import departmentService from "../../../services/departmentService";



const DateCard = ({ date, day, active, onClick, isOther }) => (
  <Box
    onClick={onClick}
    cursor="pointer"
    borderRadius="2xl"
    border="3px solid"
    borderColor={active ? "blue.500" : "blue.300"}
    bg={active ? "blue.100" : "blue.50"}
    px={6}
    py={5}
    minW="120px"
    textAlign="center"
    transition="all 0.2s"
    _hover={{ borderColor: "blue.500" }}
  >
    {isOther ? (
      <>
        <Icon as={MdCalendarMonth} boxSize={8} color="blue.500" mb={2} />
        <Text fontWeight="bold">Ngày khác</Text>
      </>
    ) : (
      <>
        <Text fontSize="xl" fontWeight="bold">
          {date}
        </Text>
        <Text color="gray.500">{day}</Text>
      </>
    )}
  </Box>
);

const SessionButton = ({ label, active, onClick }) => (
  <Button
    onClick={onClick}
    borderRadius="full"
    px={10}
    py={6}
    fontSize="lg"
    border="3px solid"
    borderColor={active ? "blue.500" : "blue.300"}
    bg={active ? "blue.100" : "blue.50"}
    _hover={{ borderColor: "blue.500" }}
  >
    {label}
  </Button>
);

/* ---------- Main Component ---------- */

const AppointmentDetailForm = ({ onDataChange }) => {
  const [selectedDate, setSelectedDate] = useState(1);
  const [session, setSession] = useState("morning");
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const toast = useToast();

  // Load departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoadingDepartments(true);
        const response = await departmentService.getAllDepartments();
        if (response.success) {
          setDepartments(response.data);
        }
      } catch (error) {
        toast({
          title: "Lỗi khi tải danh sách chuyên khoa",
          description: error.message || "Vui lòng thử lại sau",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [toast]);

  // Load doctors when department changes
  useEffect(() => {
    const fetchDoctorsByDepartment = async () => {
      if (!department) {
        setDoctors([]);
        setDoctor("");
        return;
      }

      try {
        setIsLoadingDoctors(true);
        const response = await departmentService.getDoctorsBySpecialty(department);
        if (response.success) {
          setDoctors(response.data);
          // Reset doctor selection when department changes
          setDoctor("");
        }
      } catch (error) {
        toast({
          title: "Lỗi khi tải danh sách bác sĩ",
          description: error.message || "Vui lòng thử lại sau",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setDoctors([]);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctorsByDepartment();
  }, [department, toast]);

  // Send initial data to parent on mount and when values change
  useEffect(() => {
    const selectedDateObj = generateDates().find(d => d.id === selectedDate);
    const data = {
      department,
      doctor,
      date: selectedDate,
      fullDate: selectedDateObj?.fullDate,
      session
    };
    
    if (onDataChange) {
      onDataChange(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, session, department, doctor]);

  // Update parent component when data changes
  const updateData = (updates) => {
    const currentData = {
      department,
      doctor,
      date: selectedDate,
      session,
      ...updates
    };
    onDataChange?.(currentData);
  };

  const handleDateChange = (dateId) => {
    setSelectedDate(dateId);
    const selectedDateObj = dates.find(d => d.id === dateId);
    updateData({ 
      date: dateId,
      fullDate: selectedDateObj?.fullDate 
    });
  };

  const handleSessionChange = (sessionValue) => {
    setSession(sessionValue);
    updateData({ session: sessionValue });
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setDepartment(value);
    updateData({ department: value });
  };

  const handleDoctorChange = (e) => {
    const value = e.target.value;
    setDoctor(value);
    updateData({ doctor: value });
  };

  // Generate next 7 days (starting from tomorrow)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const dayOfWeek = daysOfWeek[date.getDay()];
      
      dates.push({
        id: i - 1,
        date: `${day}/${month}`,
        day: dayOfWeek,
        fullDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        isTomorrow: i === 1
      });
    }
    
    return dates;
  };

  const dates = generateDates();

  return (
    <Box>
      {/* TITLE */}
      <Box mb={10}>
        <Text fontSize="3xl" fontWeight="bold">
          Nội dung chi tiết đặt hẹn
        </Text>
        <Box mt={2} w="280px" h="4px" bg="gray.400" />
      </Box>

      <Flex gap={20} align="flex-start" flexWrap="wrap">
        {/* LEFT COLUMN */}
        <Box flex="1" minW="320px">
          {/* Chuyên khoa */}
          <Box mb={8}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="blue.700"
              mb={3}
            >
              Chuyên khoa
            </Text>
            {isLoadingDepartments ? (
              <Flex justify="center" align="center" h="50px">
                <Spinner color="blue.500" />
              </Flex>
            ) : (
              <Select
                size="lg"
                placeholder="Chọn chuyên khoa"
                borderRadius="full"
                border="3px solid"
                borderColor="blue.300"
                bg="blue.50"
                _focus={{ borderColor: "blue.500" }}
                value={department}
                onChange={handleDepartmentChange}
              >
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            )}
          </Box>

          {/* Bác sĩ */}
          <Box mb={8}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="blue.700"
              mb={3}
            >
              Bác sĩ
            </Text>
            {isLoadingDoctors ? (
              <Flex justify="center" align="center" h="50px">
                <Spinner color="blue.500" />
              </Flex>
            ) : !department ? (
              <Select
                size="lg"
                placeholder="Vui lòng chọn chuyên khoa trước"
                borderRadius="full"
                border="3px solid"
                borderColor="gray.300"
                bg="gray.100"
                isDisabled={true}
              />
            ) : doctors.length === 0 ? (
              <Select
                size="lg"
                placeholder="Không có bác sĩ trong chuyên khoa này"
                borderRadius="full"
                border="3px solid"
                borderColor="gray.300"
                bg="gray.100"
                isDisabled={true}
              />
            ) : (
              <Select
                size="lg"
                placeholder="Chọn bác sĩ"
                borderRadius="full"
                border="3px solid"
                borderColor="blue.300"
                bg="blue.50"
                _focus={{ borderColor: "blue.500" }}
                value={doctor}
                onChange={handleDoctorChange}
              >
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.full_name} {doc.specialization ? `- ${doc.specialization}` : ''}
                  </option>
                ))}
              </Select>
            )}
          </Box>
        </Box>

        {/* RIGHT COLUMN */}
        <Box flex="1.2" minW="360px">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="blue.700"
            mb={6}
          >
            Thời gian khám
          </Text>

          {/* Date picker */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={10}>
            {dates.map((d) => (
              <DateCard
                key={d.id}
                date={d.date}
                day={d.day}
                active={selectedDate === d.id}
                onClick={() => handleDateChange(d.id)}
              />
            ))}
          </SimpleGrid>

          {/* Session */}
          <Flex gap={6}>
            <SessionButton
              label="Sáng"
              active={session === "morning"}
              onClick={() => handleSessionChange("morning")}
            />
            <SessionButton
              label="Chiều"
              active={session === "afternoon"}
              onClick={() => handleSessionChange("afternoon")}
            />
          </Flex>
        </Box>
      </Flex>

      {/* NOTE */}
      <Text mt={12} fontSize="md">
        *Lưu ý: Tổng đài viên PAMEC sẽ gọi lại cho quý khách để xác nhận
        thông tin thời gian dựa theo đăng ký và điều chỉnh nếu cần thiết.
      </Text>
    </Box>
  );
};

export default AppointmentDetailForm;
