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

import { RadioButton } from "./RadioButton";

interface ControlledRadioButtonGroupProps<
  FormValues extends FieldValues = FieldValues
> extends UseControllerProps<FormValues> {
  label?: string | React.ReactNode;
  options: { label: string; value: string }[];
}

export function ControlledRadioButtonGroup<
  FormValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  options,
}: ControlledRadioButtonGroupProps<FormValues>) {
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
      <HStack {...group} spacing={0}>
        {options.map((option, index) => {
          const radio = getRadioProps({
            value: option.value,
          });
          return (
            <RadioButton
              key={option.label}
              {...radio}
              containerProps={{
                flex: 1,
                textAlign: "center",
              }}
              innerContainerProps={{
                borderLeftWidth: index === options.length - 1 ? 0 : "1px",
                borderRightWidth: index === 0 ? 0 : "1px",
                roundedLeft: index === 0 ? "lg" : "none",
                roundedRight: index === options.length - 1 ? "lg" : "none",
              }}
            >
              {option.label}
            </RadioButton>
          );
        })}
      </HStack>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
