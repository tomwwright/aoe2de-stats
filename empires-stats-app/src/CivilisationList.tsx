import React, { useContext } from "react";

import { EmpiresDatContext } from "./EmpiresDatContext";
import { DataTable } from "./DataTable";

export const CivilisationList: React.StatelessComponent<{}> = () => {
  const empires = useContext(EmpiresDatContext);

  return <DataTable data={empires.civilisations} />;
};
