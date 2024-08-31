import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

async function parseMaterialsImport(data: { file: File | File[] }) {
  const { file } = data;

  if (file) {
    const formData = new FormData();
    formData.append("file", file as File);

    const resData = await fetch("/api/materials/parseCsv", {
      method: "POST",
      body: formData,
    });

    return await resData.json();
  }

  return null;
}

export function useParseMaterialsImport() {
  const toast = useToast();

  return useMutation({
    mutationFn: parseMaterialsImport,
    onSuccess: () => {
      toast({
        title: "Parsing complete",
        description: "Your file has been parsed.",
        status: "success",
      });
    },
  });
}
