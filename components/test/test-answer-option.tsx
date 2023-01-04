import { useRadio, Box } from "@chakra-ui/react";

export default function TestAnswerOption(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box
      w="full"
      as="label"
    >
      <input {...input} />
      <Box
        px={5}
        py={3}
        cursor="pointer"
        borderWidth={1}
        borderRadius="md"
        userSelect="none"
        _checked={{
          bg: "primary.500",
          color: "white",
          borderColor: "primary.500",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        {...checkbox}
      >
        {props.children}
      </Box>
    </Box>
  );
}
