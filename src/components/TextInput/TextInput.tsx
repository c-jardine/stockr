import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  type FormControlProps,
  type InputProps,
} from "@chakra-ui/react";
import React from "react";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { FaCircle } from "react-icons/fa6";
import { NumericFormatProps } from "react-number-format";

interface TextInputProps<FormValues extends FieldValues = FieldValues>
  extends UseControllerProps<FormValues> {
  label?: string;
  isRequired?: boolean;
  formControlProps?: FormControlProps;
  inputProps?: InputProps & NumericFormatProps;
  children?: React.ReactNode;
}

export function TextInput<FormValues extends FieldValues = FieldValues>({
  name,
  label,
  control,
  rules,
  isRequired = false,
  shouldUnregister,
  formControlProps,
  inputProps,
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
    <FormControl
      id={name}
      isInvalid={!!error}
      isRequired={isRequired}
      {...formControlProps}
    >
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
      {children ? (
        children
      ) : (
        <Input variant="input" {...field} {...inputProps} />
      )}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
