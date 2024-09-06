import { useMemo } from "react";

import { api } from "~/utils/api";

export default function useMaterialCategoriesOptions() {
  const query = api.material.getCategories.useQuery();

  const { data } = query;

  const categoryOptions = useMemo(() => {
    return (
      data?.map(({ id, name }) => ({
        label: name,
        value: id,
      })) || []
    );
  }, [data]);

  return { categoryOptions, query };
}
