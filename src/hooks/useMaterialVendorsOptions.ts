import React from "react";

import { api } from "~/utils/api";

export default function useMaterialVendorsOptions() {
  const query = api.material.getVendors.useQuery();

  const { data } = query;

  const vendorOptions = React.useMemo(() => {
    return (
      data?.map(({ name }) => ({
        label: name,
        value: name,
      })) || []
    );
  }, [data]);

  return { vendorOptions, query };
}
