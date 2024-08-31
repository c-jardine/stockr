export function parseMaterialsImport(data: { file: File | File[] }) {
  const { file } = data;

  if (file) {
    const formData = new FormData();
    formData.append("file", file as File);

    return fetch("/api/materials/parseCsv", {
      method: "POST",
      body: formData,
    });
  }
}
