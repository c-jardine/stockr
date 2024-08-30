export type SelectInput = {
  label: string;
  value: string;
};

export function mapToSelectInput({
  id,
  name,
}: {
  id: string;
  name: string;
}): SelectInput {
  return { label: name, value: id };
}
