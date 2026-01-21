import { useState } from "react";
import { Box, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AppointmentDetail from "../../components/customer/appointmentcontent/content_detail";
import CustomerInfoForm from "../../components/customer/appointmentcontent/info_customer";
import Hero from "../../components/customer/HeroSection";
import Services from "../../components/customer/homecontent/Services";
import appointmentService from "../../services/appointmentService";

const Appointment = () => {
  const [selectedAppointmentData, setSelectedAppointmentData] = useState({
    department: "",
    doctor: "",
    date: "",
    session: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleAppointmentDetailsChange = (data) => {
    setSelectedAppointmentData(prev => ({ ...prev, ...data }));
  };

  const handleSubmitAppointment = async (customerData) => {
    try {
      setIsSubmitting(true);

      const appointmentData = {
        ...customerData,
        appointmentDate: selectedAppointmentData.date,
        timeSlot: selectedAppointmentData.session,
        department: selectedAppointmentData.department,
        doctor: selectedAppointmentData.doctor,
        status: "pending",
      };

      await appointmentService.createAppointment(appointmentData);

      toast({
        title: "Đặt lịch thành công!",
        description: "Tổng đài viên sẽ gọi lại để xác nhận thông tin.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form or redirect
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast({
        title: "Đặt lịch thất bại",
        description: error.message || "Vui lòng thử lại sau",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Box>
      <Container maxW="7xl">
        {/* Hero + Services */}
        <Box position="relative">
          <Hero />
          <Services />
        </Box>

        {/* Breadcrumb */}
        <Breadcrumb mt={8} mb={6} fontSize="md" color="blue.600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Chuyên khoa</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Khoa Khám tổng quát</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Section 1: Chi tiết đặt hẹn */}
        <Box mb={12} bg="blue.50" p={10} borderRadius="3xl">
          <AppointmentDetail onDataChange={handleAppointmentDetailsChange} />
        </Box>

        {/* Section 2: Thông tin khách hàng */}
        <Box mb={20} bg="blue.50" p={10} borderRadius="3xl">
          <CustomerInfoForm 
            onSubmit={handleSubmitAppointment}
            selectedData={selectedAppointmentData}
            isLoading={isSubmitting}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Appointment;
