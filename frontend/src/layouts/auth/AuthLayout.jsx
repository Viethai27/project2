import { Box, Flex, Container } from "@chakra-ui/react";

const AuthLayout = ({ children }) => {
  return (
    <Flex
      minH="100vh"
      bg="gray.50"
      align="center"
      justify="center"
      py={12}
    >
      <Container maxW="md">
        {children}
      </Container>
    </Flex>
  );
};

export default AuthLayout;
