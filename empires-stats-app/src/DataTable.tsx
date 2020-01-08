import React from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import _ from "lodash";

type DataTableProps = {
  data: object[];
};

export const DataTable: React.StatelessComponent<DataTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <p>No data</p>;
  }

  const dataWithRowId = withRowIdColumn(data);

  return (
    <div
      className="ag-theme-balham"
      style={{
        height: "600px",
        width: "100%"
      }}
    >
      <AgGridReact columnDefs={extractHeaders(dataWithRowId)} rowData={dataWithRowId}></AgGridReact>
    </div>
  );
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
