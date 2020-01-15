import React from "react";
import { ColDef } from "ag-grid-community";
import { Table } from "./Table";
import _ from "lodash";

type DataTableProps = {
  data: object[];
};

export const DataTable: React.StatelessComponent<DataTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <p>No data</p>;
  }

  const dataWithRowId = withRowIdColumn(data);

  return <Table columnDefs={extractHeaders(dataWithRowId)} rowData={dataWithRowId}></Table>;
};

const extractHeaders = (rows: object[]): ColDef[] => {
  const keys = _.uniq(_.concat([], ...rows.map(row => Object.keys(row))));

  return keys.map(key => ({
    headerName: key,
    field: key,
    sortable: true,
    filter: true
  }));
};

const withRowIdColumn = (data: object[]) =>
  data.map((row, i) => ({
    "#": i,
    ...row
  }));
