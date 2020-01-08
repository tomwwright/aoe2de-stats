import React, { useContext } from "react";

import { EmpiresDatContext } from "./EmpiresDatContext";
import { DataTable } from "./DataTable";

export const TechList: React.StatelessComponent<{}> = () => {
  const empires = useContext(EmpiresDatContext);

  return <DataTable data={empires.techs} />;
};
