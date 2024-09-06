import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

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

type ParseMaterialsImportData = Awaited<
  ReturnType<typeof parseMaterialsImport>
>;
type ParseMaterialsImportVariables = Parameters<typeof parseMaterialsImport>[0];

export function useParseMaterialsImport(
  options?: Omit<
    UseMutationOptions<
      ParseMaterialsImportData,
      unknown,
      ParseMaterialsImportVariables,
      unknown
    >,
    "mutationFn"
  >
) {
  return useMutation({
    mutationFn: parseMaterialsImport,
    ...options,
  });
}
