import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
} from "@chakra-ui/react";
import React from "react";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { FaCircle } from "react-icons/fa6";

interface TextInputProps<FormValues extends FieldValues = FieldValues>
  extends UseControllerProps<FormValues> {
  label?: string;
  isRequired?: boolean;
  children?: React.ReactNode;
}

export default function TextInput<
  FormValues extends FieldValues = FieldValues
>({
  name,
  label,
  control,
  rules,
  isRequired = false,
  shouldUnregister,
  children,
}: TextInputProps<FormValues>) {
  const {
    field,
    fieldState: { error },
  } = useController<FormValues>({
    name,
    control,
    rules,
    shouldUnregister,
  });

  return (
    <FormControl id={name} isInvalid={!!error} isRequired={isRequired}>
      {label && (
        <FormLabel
          display="flex"
          alignItems="center"
          gap={1}
          requiredIndicator={<Icon as={FaCircle} boxSize={1} />}
        >
          {label}
        </FormLabel>
      )}
      {children ? children : <Input {...field} />}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
