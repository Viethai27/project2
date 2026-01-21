import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Checkbox,
  Link as ChakraLink,
  useToast,
  Image,
  Flex,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { login } from "../../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

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

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await login(formData);
      
      // Store token
      localStorage.setItem("token", response.token);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // Store user info
      localStorage.setItem("user", JSON.stringify(response.user));

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${response.user.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect based on role
      const role = response.user.role;
      
      if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (role === "receptionist") {
        navigate("/receptionist/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Email hoặc mật khẩu không đúng",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="white" p={8} borderRadius="xl" boxShadow="xl">
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
          Đăng nhập
        </Heading>
        <Text color="gray.600">
          Đăng nhập vào hệ thống quản lý bệnh viện PAMEC
        </Text>
      </VStack>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Nhập email của bạn"
            isRequired
          />

          <AuthInput
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Nhập mật khẩu"
            isRequired
          />

          <Flex w="full" justify="space-between" align="center">
            <Checkbox
              colorScheme="teal"
              isChecked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Ghi nhớ đăng nhập
            </Checkbox>
            <ChakraLink 
              as={Link} 
              to="/forgot-password" 
              color="teal.600" 
              fontSize="sm" 
              fontWeight="medium"
            >
              Quên mật khẩu?
            </ChakraLink>
          </Flex>

          <AuthButton isLoading={isLoading} type="submit">
            Đăng nhập
          </AuthButton>
        </VStack>
      </form>

      {/* Register Link */}
      <Text textAlign="center" mt={6} color="gray.600">
        Chưa có tài khoản?{" "}
        <ChakraLink as={Link} to="/register" color="teal.600" fontWeight="bold">
          Đăng ký ngay
        </ChakraLink>
      </Text>
    </Box>
  );
};

export default Login;
