import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const AuthInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  isRequired = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel fontWeight="semibold" color="gray.700">
        {label}
      </FormLabel>
      <InputGroup>
        <Input
          type={isPassword && !showPassword ? "password" : "text"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          size="lg"
          borderColor="gray.300"
          _hover={{ borderColor: "teal.400" }}
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px #319795" }}
        />
        {isPassword && (
          <InputRightElement height="full">
            <IconButton
              size="sm"
              variant="ghost"
              icon={showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            />
          </InputRightElement>
        )}
      </InputGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default AuthInput;
