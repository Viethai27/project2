import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/doctor/Sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";

const DoctorLayout = () => {
  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <Flex minH="100vh" bg="gray.50">
        {/* Sidebar - Fixed */}
        <Sidebar />

        {/* Main Content Area */}
        <Box
          flex="1"
          ml="280px" // Match sidebar width
          p={6}
          bg="gray.50"
        >
          <Outlet />
        </Box>
      </Flex>
    </ProtectedRoute>
  );
};

export default DoctorLayout;
