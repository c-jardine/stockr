import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import {
  CreatableSelect as ChakraCreatableSelect,
  type GroupBase,
  type CreatableProps as SelectProps,
} from "chakra-react-select";
import React from "react";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

export type MultiSelectInput = {
  label: string;
  value: string;
};

interface ControlledSelectProps<
  FormValues extends FieldValues = FieldValues,
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Omit<SelectProps<Option, IsMulti, Group>, "name" | "defaultValue">,
    UseControllerProps<FormValues> {
  label?: string | React.ReactNode;
}

/**
 * An attempt to make a reusable chakra-react-select form component
 *
 * @param props - The combined props of the chakra-react-select component and the useController hook
 */
export function CreatableSelect<
  FormValues extends FieldValues = FieldValues,
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  name,
  label,
  options,
  control,
  rules,
  shouldUnregister,
  ...selectProps
}: ControlledSelectProps<FormValues, Option, IsMulti, Group>) {
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
    <FormControl id={name} isInvalid={!!error}>
      {label && <FormLabel w="full">{label}</FormLabel>}
      <ChakraCreatableSelect<Option, IsMulti, Group>
        options={options}
        chakraStyles={{
          option: (provided) => ({
            ...provided,
            fontSize: "sm",
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            fontSize: "xs",
          }),
        }}
        {...selectProps}
        {...field}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
