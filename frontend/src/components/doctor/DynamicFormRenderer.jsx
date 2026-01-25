import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  FormHelperText,
  Text,
  VStack,
  Divider,
  Button,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const DynamicFormRenderer = ({ sections, formData, onChange, readOnly = false }) => {
  const renderField = (field, sectionName, arrayIndex = null) => {
    const fieldKey = arrayIndex !== null 
      ? `${sectionName}.${arrayIndex}.${field.field_name}`
      : field.field_name;
    
    const value = arrayIndex !== null
      ? formData[sectionName]?.[arrayIndex]?.[field.field_name] || ''
      : formData[field.field_name] || '';

    const handleChange = (newValue) => {
      if (arrayIndex !== null) {
        const sectionArray = formData[sectionName] || [];
        const updatedArray = [...sectionArray];
        if (!updatedArray[arrayIndex]) {
          updatedArray[arrayIndex] = {};
        }
        updatedArray[arrayIndex][field.field_name] = newValue;
        onChange(sectionName, updatedArray);
      } else {
        onChange(field.field_name, newValue);
      }
    };

    const commonProps = {
      isRequired: field.required,
      isDisabled: readOnly
    };

    switch (field.type) {
      case 'text':
      case 'date':
      case 'datetime-local':
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.label}
            pattern={field.validation?.pattern}
            {...commonProps}
          />
        );

      case 'number':
        return (
          <NumberInput
            value={value}
            onChange={(valueString) => handleChange(valueString)}
            min={field.validation?.min}
            max={field.validation?.max}
            {...commonProps}
          >
            <NumberInputField placeholder={field.label} />
          </NumberInput>
        );

      case 'select':
        return (
          <Select
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`Chọn ${field.label.toLowerCase()}`}
            {...commonProps}
          >
            {field.validation?.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value}
            onChange={handleChange}
            {...commonProps}
          >
            <Stack direction="row" spacing={4}>
              {field.validation?.options?.map((option) => (
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.label}
            rows={4}
            {...commonProps}
          />
        );

      default:
        return <Input value={value} onChange={(e) => handleChange(e.target.value)} {...commonProps} />;
    }
  };

  const renderSection = (section) => {
    // Handle array sections (like newborns)
    if (section.is_array) {
      const sectionData = formData[section.section_name] || [{}];
      
      const addArrayItem = () => {
        const updatedArray = [...sectionData, {}];
        onChange(section.section_name, updatedArray);
      };

      const removeArrayItem = (index) => {
        const updatedArray = sectionData.filter((_, i) => i !== index);
        onChange(section.section_name, updatedArray.length > 0 ? updatedArray : [{}]);
      };

      return (
        <Box key={section.section_id} mb={8}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="teal.600">
              {section.section_label}
            </Text>
            {!readOnly && (
              <Button
                leftIcon={<AddIcon />}
                colorScheme="teal"
                size="sm"
                onClick={addArrayItem}
              >
                Thêm {section.section_label}
              </Button>
            )}
          </HStack>

          {sectionData.map((item, index) => (
            <Box key={index} p={4} mb={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <HStack justify="space-between" mb={3}>
                <Text fontWeight="semibold" color="gray.700">
                  {section.section_label} #{index + 1}
                </Text>
                {!readOnly && sectionData.length > 1 && (
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => removeArrayItem(index)}
                    aria-label="Xóa"
                  />
                )}
              </HStack>
              <VStack spacing={4} align="stretch">
                {section.fields?.map((field) => (
                  <FormControl key={field.field_name}>
                    <FormLabel>{field.label}</FormLabel>
                    {renderField(field, section.section_name, index)}
                    {field.help_text && (
                      <FormHelperText>{field.help_text}</FormHelperText>
                    )}
                  </FormControl>
                ))}
              </VStack>
            </Box>
          ))}
        </Box>
      );
    }

    // Regular sections
    return (
      <Box key={section.section_id} mb={8}>
        <Text fontSize="xl" fontWeight="bold" color="teal.600" mb={4}>
          {section.section_label}
        </Text>
        <VStack spacing={4} align="stretch">
          {section.fields?.map((field) => (
            <FormControl key={field.field_name}>
              <FormLabel>
                {field.label}
                {field.required && <Text as="span" color="red.500"> *</Text>}
              </FormLabel>
              {renderField(field, section.section_name)}
              {field.help_text && (
                <FormHelperText>{field.help_text}</FormHelperText>
              )}
            </FormControl>
          ))}
        </VStack>
        <Divider mt={6} />
      </Box>
    );
  };

  return (
    <Box>
      {sections?.sort((a, b) => a.section_id - b.section_id).map(renderSection)}
    </Box>
  );
};

export default DynamicFormRenderer;
