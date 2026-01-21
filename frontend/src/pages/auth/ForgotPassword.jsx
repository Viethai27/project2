import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast,
  Image,
  Flex,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { forgotPassword } from "../../services/passwordService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      
      setIsSubmitted(true);
      
      toast({
        title: "Đã gửi email",
        description: result.message || "Vui lòng kiểm tra email để đặt lại mật khẩu",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Log reset link for development (remove in production)
      if (result.resetLink) {
        console.log('Reset password link:', result.resetLink);
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể gửi email. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Box bg="white" p={8} borderRadius="xl" boxShadow="xl" maxW="md">
        {/* Logo */}
        <Flex justify="center" mb={6}>
          <Image
            src="/logo_pamec.png"
            alt="PAMEC Logo"
            height="60px"
            fallback={
              <Heading size="lg" color="teal.600">
                PAMEC
              </Heading>
            }
          />
        </Flex>

        <VStack spacing={6} textAlign="center">
          <Box
            bg="green.50"
            p={4}
            borderRadius="full"
            border="2px solid"
            borderColor="green.500"
          >
            <Text fontSize="4xl">✓</Text>
          </Box>

          <Heading size="lg" color="gray.800">
            Email đã được gửi!
          </Heading>

          <Text color="gray.600">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email:
          </Text>

          <Text fontWeight="bold" color="teal.600">
            {email}
          </Text>

          <Text color="gray.600" fontSize="sm">
            Vui lòng kiểm tra hộp thư đến (và cả thư rác) để tìm email từ chúng
            tôi.
          </Text>

          <VStack spacing={3} w="full">
            <AuthButton onClick={() => navigate("/login")} w="full">
              Quay lại đăng nhập
            </AuthButton>

            <ChakraLink
              color="teal.600"
              fontSize="sm"
              fontWeight="medium"
              onClick={() => setIsSubmitted(false)}
              cursor="pointer"
            >
              Gửi lại email
            </ChakraLink>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg="white" p={8} borderRadius="xl" boxShadow="xl" maxW="md">
      {/* Logo */}
      <Flex justify="center" mb={6}>
        <Image
          src="/logo_pamec.png"
          alt="PAMEC Logo"
          height="60px"
          fallback={
            <Heading size="lg" color="teal.600">
              PAMEC
            </Heading>
          }
        />
      </Flex>

      {/* Title */}
      <VStack spacing={2} mb={8} textAlign="center">
        <Heading size="xl" color="gray.800">
          Quên mật khẩu?
        </Heading>
        <Text color="gray.600">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu
        </Text>
      </VStack>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            error={error}
            placeholder="Nhập email của bạn"
            isRequired
          />

          <AuthButton isLoading={isLoading} type="submit" w="full">
            Gửi email đặt lại mật khẩu
          </AuthButton>
        </VStack>
      </form>

      {/* Back to Login Link */}
      <Text textAlign="center" mt={6} color="gray.600">
        <ChakraLink as={Link} to="/login" color="teal.600" fontWeight="bold">
          ← Quay lại đăng nhập
        </ChakraLink>
      </Text>
    </Box>
  );
};

export default ForgotPassword;
