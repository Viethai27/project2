import { Button } from "@chakra-ui/react";

const AuthButton = ({ children, isLoading, onClick, type = "submit", ...props }) => {
  return (
    <Button
      type={type}
      colorScheme="teal"
      size="lg"
      width="full"
      isLoading={isLoading}
      loadingText="Đang xử lý..."
      onClick={onClick}
      _hover={{ bg: "teal.600" }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AuthButton;
