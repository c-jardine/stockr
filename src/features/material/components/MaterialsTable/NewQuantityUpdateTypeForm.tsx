import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  ScaleFade,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type MaterialQuantityUpdateAction } from "@prisma/client";
import { useForm } from "react-hook-form";
import { FaPlus, FaQuestion } from "react-icons/fa6";

import { ControlledColorPicker } from "~/components/ControlledColorPicker";
import { ControlledRadioButtonGroup } from "~/components/ControlledRadioButtonGroup";
import { TextInput } from "~/components/TextInput";
import { colors } from "~/styles/chakra/colors";
import {
  newQuantityAdjustmentActionSchema,
  type NewQuantityAdjustmentActionFormType,
} from "~/types/material";
import { api } from "~/utils/api";

export function NewQuantityUpdateTypeForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewQuantityAdjustmentActionFormType>({
    resolver: zodResolver(newQuantityAdjustmentActionSchema),
  });

  const adjustmentActionOptions: {
    label: string;
    value: MaterialQuantityUpdateAction;
  }[] = [
    { label: "Decrease", value: "DECREASE" },
    { label: "Set", value: "SET" },
    { label: "Increase", value: "INCREASE" },
  ];

  const skippedColors = [
    "black",
    "slate",
    "gray",
    "neutral",
    "stone",
    "amber",
    "lime",
    "green",
    "teal",
    "sky",
    "violet",
    "fuchsia",
    "rose",
  ];

  const colorList = Object.entries(colors)
    .filter(([colorName]) => !skippedColors.includes(colorName))
    .map(([colorName]) => ({ label: colorName, value: colorName }));

  const toast = useToast();

  const utils = api.useUtils();
  const mutation = api.material.createQuantityAdjustmentType.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "New adjustment type",
        description: `Created adjustment type: ${data.type}`,
        status: "success",
      });

      await utils.material.getQuantityUpdateTypes.invalidate();

      onClose();
    },
  });

  async function onSubmit(data: NewQuantityAdjustmentActionFormType) {
    await mutation.mutateAsync(data);
  }

  return (
    <>
      <Button
        leftIcon={<Icon as={FaPlus} />}
        variant="primary"
        size="xs"
        fontSize="xs"
        onClick={onOpen}
      >
        New
      </Button>
      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New quantity update type</ModalHeader>
          <ModalBody>
            <Stack
              as="form"
              id="new-material-quantity-update-type"
              onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
              spacing={4}
            >
              <TextInput control={control} name="name" label="Name" />

              <ControlledColorPicker
                control={control}
                name="color"
                label="Color"
                options={colorList}
              />
              {/* <FormControl isInvalid={!!errors.color}>
                <FormLabel>Color</FormLabel>
                <Flex justifyContent="space-between" alignSelf="center" gap={1}>
                  {colorList.map((color, index) => {
                    return <ColorChip key={index} color={color} />;
                  })}
                </Flex>
                {errors.color && (
                  <FormErrorMessage>{errors.color.message}</FormErrorMessage>
                )}
              </FormControl> */}

              <ControlledRadioButtonGroup
                control={control}
                name="adjustmentAction"
                label={
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text>Adjustment action</Text>
                    <AdjustmentActionHelperPopover />
                  </HStack>
                }
                options={adjustmentActionOptions}
              />
            </Stack>
          </ModalBody>
          <ModalFooter gap={4}>
            <ScaleFade in={!isSubmitting} initialScale={0.9}>
              <Button onClick={onClose}>Cancel</Button>
            </ScaleFade>
            <Button
              type="submit"
              form="new-material-quantity-update-type"
              variant="primary"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function AdjustmentActionHelperPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          icon={<Icon as={FaQuestion} boxSize={3} />}
          aria-label="Learn more about adjustment actions"
          size="xs"
          rounded="full"
          variant="outline"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Quantity adjustment actions</PopoverHeader>
        <PopoverBody pb={4}>
          <Stack>
            <Text>
              Quantity adjustment actions determine whether your action will
              increase, decrease, or set the quantity.
            </Text>
            <Box position="relative" py={4}>
              <Divider />
              <AbsoluteCenter fontWeight="semibold" bg="white" px="4">
                Example
              </AbsoluteCenter>
            </Box>
            <Text fontWeight="semibold">Adjustment quantity: 5 units</Text>
            <Text>
              <Text as="span" fontWeight="semibold">
                Decrease:
              </Text>{" "}
              Reduce current quantity by 5 units
            </Text>
            <Text>
              <Text as="span" fontWeight="semibold">
                Set:
              </Text>{" "}
              Set current quantity to 5 units
            </Text>
            <Text>
              <Text as="span" fontWeight="semibold">
                Increase:
              </Text>{" "}
              Increase current quantity by 5 units
            </Text>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
