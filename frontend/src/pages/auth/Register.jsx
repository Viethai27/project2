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
import { register } from "../../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
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

    if (!formData.name) {
      newErrors.name = "Vui lòng nhập họ tên";
    } else if (formData.name.length < 3) {
      newErrors.name = "Họ tên phải có ít nhất 3 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa chữ hoa, chữ thường và số";
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
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);

      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng đăng nhập để tiếp tục",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra. Vui lòng thử lại",
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
          Đăng ký tài khoản
        </Heading>
        <Text color="gray.600">
          Tạo tài khoản mới để sử dụng hệ thống PAMEC
        </Text>
      </VStack>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <AuthInput
            label="Họ và tên"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Nhập họ và tên"
            isRequired
          />

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
            label="Số điện thoại"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="Nhập số điện thoại"
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

          <AuthInput
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Nhập lại mật khẩu"
            isRequired
          />

          <AuthButton isLoading={isLoading} type="submit">
            Đăng ký
          </AuthButton>
        </VStack>
      </form>

      {/* Login Link */}
      <Text textAlign="center" mt={6} color="gray.600">
        Đã có tài khoản?{" "}
        <ChakraLink as={Link} to="/login" color="teal.600" fontWeight="bold">
          Đăng nhập ngay
        </ChakraLink>
      </Text>
    </Box>
  );
};

export default Register;
