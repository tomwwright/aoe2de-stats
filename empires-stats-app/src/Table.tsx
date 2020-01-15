import React from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import _ from "lodash";

type TableProps = {
  columnDefs: ColDef[];
  rowData: any[];
};

export const Table: React.StatelessComponent<TableProps> = ({ columnDefs, rowData }) => {
  return (
    <div
      className="ag-theme-balham"
      style={{
        height: "600px",
        width: "100%"
      }}
    >
      <AgGridReact columnDefs={columnDefs} rowData={rowData} />
    </div>
  );
};
