import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import type FileUploaderSrc from "react-drag-drop-files/dist/src/FileUploader";
import { Controller, useForm } from "react-hook-form";
import { FaFileImport } from "react-icons/fa6";
import { z } from "zod";

// Workaround to make sure the component is properly typed.
const FileUploaderTyped: typeof FileUploaderSrc = FileUploader;

const schema = z.object({
  file: z.union([z.instanceof(File), z.instanceof(File).array()]),
});

type FormType = z.infer<typeof schema>;

export function ImportCsv() {
  // For focusing on submit button after upload
  const submitRef = React.useRef<HTMLButtonElement>(null);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormType>({
    defaultValues: {
      file: undefined,
    },
    resolver: zodResolver(schema),
  });

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      reset({ file: undefined });
    },
  });

  const fileTypes = ["CSV"];

  function handleClose() {
    reset({ file: undefined });
    onClose();
  }

  async function onSubmit(data: FormType) {
    const { file } = data;
    if (file) {
      const formData = new FormData();
      formData.append("file", file as File);

      const response = await fetch("/api/materials/parseCsv", {
        method: "POST",
        body: formData,
      });

      // TODO: Do something with this!
      const resData = await response.json();
    }
  }

  return (
    <>
      <MenuItem
        icon={<Icon as={FaFileImport} boxSize={4} />}
        fontSize="sm"
        onClick={onOpen}
      >
        Import CSV
      </MenuItem>
      <Modal {...{ isOpen, onClose }} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading as="h1">Upload CSV</Heading>
            <Text
              mt={2}
              color="zinc.600"
              fontSize="sm"
              fontWeight="normal"
              fontStyle="italic"
            >
              Only accepts{" "}
              <Text as="span" px={1} fontFamily="monospace" bg="zinc.200">
                .csv
              </Text>{" "}
              files.
            </Text>
          </ModalHeader>

          <ModalBody>
            <Stack
              as="form"
              id="import-materials-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl>
                <Controller
                  control={control}
                  name="file"
                  render={({ field: { onChange, value } }) => (
                    <FileUploaderTyped
                      handleChange={(value) => {
                        if (value) {
                          onChange(value);
                          if (submitRef.current) {
                            submitRef.current.focus();
                          }
                        }
                      }}
                      name="file"
                      types={fileTypes}
                      fileOrFiles={value}
                    />
                  )}
                />
                {errors.file && (
                  <FormErrorMessage>{errors.file.message}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter justifyContent="flex-end" gap={4}>
            <ScaleFade in={!isSubmitting} initialScale={0.9}>
              <Button size="sm" onClick={handleClose}>
                Cancel
              </Button>
            </ScaleFade>

            <Button
              ref={submitRef}
              type="submit"
              form="import-materials-form"
              variant="primary"
              size="sm"
              cursor={watch("file") ? "pointer" : "not-allowed"}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Analyze
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
