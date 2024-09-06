import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import {
  Select,
  type GroupBase,
  type CreatableProps as SelectProps,
} from "chakra-react-select";
import { ReactNode } from "react";
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
  label?: string | ReactNode;
}

/**
 * An attempt to make a reusable chakra-react-select form component
 *
 * @param props - The combined props of the chakra-react-select component and the useController hook
 */
export function ControlledSelect<
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
      <Select<Option, IsMulti, Group>
        options={options}
        chakraStyles={{
          multiValueLabel: (provided) => ({
            ...provided,
            fontSize: "xs",
          }),
          singleValue: (provided) => ({
            ...provided,
            fontSize: "xs",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            px: 2,
          }),
          groupHeading: (provided) => ({
            ...provided,
            pl: 2,
            fontSize: "xs",
            fontWeight: "bold",
          }),
          option: (provided) => ({
            ...provided,
            pl: 4,
            fontSize: "xs",
          }),
          noOptionsMessage: (provided) => ({
            ...provided,
            fontSize: "xs",
            fontStyle: "italic",
          }),
          placeholder: (provided) => ({
            ...provided,
            fontSize: "sm",
          }),
        }}
        {...selectProps}
        {...field}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
