import { ValueFormatterParams } from "ag-grid-community";

export const formatNumber = (params: ValueFormatterParams) => {
  return params.value.toFixed(2);
};
