import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  useRadioGroup,
} from "@chakra-ui/react";

import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from "react-hook-form";
import { ColorChip } from "./ColorChip";

interface ControlledColorPickerProps<
  FormValues extends FieldValues = FieldValues
> extends UseControllerProps<FormValues> {
  label?: string | React.ReactNode;
  options: { label: string; value: string }[];
}

export function ControlledColorPicker<
  FormValues extends FieldValues = FieldValues
>({ control, name, label, options }: ControlledColorPickerProps<FormValues>) {
  const {
    field,
    fieldState: { error },
  } = useController<FormValues>({
    control,
    name,
  });

  const { getRootProps, getRadioProps } = useRadioGroup(field);

  const group = getRootProps();

  return (
    <FormControl id={name} isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <HStack {...group} justifyContent="center" spacing={1}>
        {options.map((option) => {
          const radio = getRadioProps({
            value: option.value,
          });
          return (
            <ColorChip key={option.label} color={option.value} {...radio}>
              {option.label}
            </ColorChip>
          );
        })}
      </HStack>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
