import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  Link,
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
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import type FileUploaderSrc from "react-drag-drop-files/dist/src/FileUploader";
import { Controller, useForm } from "react-hook-form";
import { FaFileImport } from "react-icons/fa6";
import { z } from "zod";

import { ImportMaterialsOverview } from "./ImportMaterialsOverview";
import { useParseMaterialsImport } from "./hooks/useParseMaterialsImport";

// Workaround to make sure the component is properly typed.
const FileUploaderTyped: typeof FileUploaderSrc = FileUploader;

const schema = z.object({
  file: z.union([z.instanceof(File), z.instanceof(File).array()]),
});

type FormType = z.infer<typeof schema>;

export function ImportCsvMenuButton() {
  // For focusing on submit button after upload
  const submitRef = useRef<HTMLButtonElement>(null);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      file: undefined,
    },
    resolver: zodResolver(schema),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fileTypes = ["CSV"];

  function handleClose() {
    reset({ file: undefined });
    onClose();
  }

  const toast = useToast();

  const { mutateAsync, data: parsedData } = useParseMaterialsImport({
    onSuccess: () => {
      toast({
        title: "Parsing complete",
        description: "Your file has been parsed.",
        status: "success",
      });
    },
  });

  async function onSubmit(data: FormType) {
    await mutateAsync(data);
  }

  if (parsedData) {
    return <ImportMaterialsOverview {...parsedData} />;
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
            <Text mt={2} fontSize="sm" color="zinc.600">
              Download the template{" "}
              <Link
                href="/docs/craftmate-materials-import-template.csv"
                fontWeight="bold"
                color="blue.500"
                download
              >
                here
              </Link>
              .
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
