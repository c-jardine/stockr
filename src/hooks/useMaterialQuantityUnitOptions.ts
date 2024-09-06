import { useMemo } from "react";

import { api } from "~/utils/api";
import { SelectInput } from "~/utils/selectInput";

interface FormattedGroup {
  label: string;
  options: SelectInput[];
}

export default function useMaterialQuantityUnitOptions() {
  const query = api.material.getQuantityUnits.useQuery();

  const { data } = query;

  const quantityUnitOptions = useMemo(() => {
    if (data) {
      return (
        data.reduce((groups, unit) => {
          // Find the existing group or create a new one
          const group = groups.find((g) => g.label === unit.group);

          const option: SelectInput = {
            label: unit.name,
            value: unit.name,
          };

          if (group) {
            group.options.push(option);
          } else {
            groups.push({
              label: unit.group,
              options: [option],
            });
          }

          return groups;
        }, [] as FormattedGroup[]) || []
      );
    }
    return [];
  }, [data]);

  const groupOrder = [
    "Count",
    "Weight",
    "Length",
    "Area",
    "Volume",
    "Miscellaneous",
  ];

  quantityUnitOptions.sort(
    (a, b) => groupOrder.indexOf(a.label) - groupOrder.indexOf(b.label)
  );

  return { quantityUnitOptions, query };
}
