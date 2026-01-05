import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/receptionist/Sidebar";
import Header from "../../components/receptionist/Header";

const ReceptionistLayout = () => {
  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content Area with Header */}
      <Box flex="1" ml="280px">
        {/* Header - Fixed at top */}
        <Header />

        {/* Page Content */}
        <Box p={6} mt="70px">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default ReceptionistLayout;
