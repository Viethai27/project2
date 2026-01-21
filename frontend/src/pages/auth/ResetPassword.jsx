import { useState, useEffect } from "react";
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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { resetPassword } from "../../services/passwordService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL query parameters
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast({
        title: "Link không hợp lệ",
        description: "Vui lòng sử dụng link được gửi qua email",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu mới";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa cả chữ và số";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const result = await resetPassword(token, formData.password);

      toast({
        title: "Đặt lại mật khẩu thành công",
        description: result.message || "Bạn có thể đăng nhập bằng mật khẩu mới",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể đặt lại mật khẩu. Link có thể đã hết hạn.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          Đặt lại mật khẩu
        </Heading>
        <Text color="gray.600">
          Nhập mật khẩu mới của bạn
        </Text>
      </VStack>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <AuthInput
            label="Mật khẩu mới"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Nhập mật khẩu mới"
            isRequired
          />

          <AuthInput
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Nhập lại mật khẩu mới"
            isRequired
          />

          <Text fontSize="sm" color="gray.600" alignSelf="flex-start" mt={-2}>
            Mật khẩu phải có ít nhất 6 ký tự, bao gồm cả chữ và số
          </Text>

          <AuthButton isLoading={isLoading} type="submit" w="full">
            Đặt lại mật khẩu
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

export default ResetPassword;
