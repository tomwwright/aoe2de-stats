import React, { useContext } from "react";

import { EmpiresDatContext } from "./EmpiresDatContext";
import { DataTable } from "./DataTable";

export const UnitAndBuildingList: React.StatelessComponent<{}> = () => {
  const empires = useContext(EmpiresDatContext);

  const unitsAndBuildings = ([] as any[]).concat(empires.civilisations[0].units, empires.civilisations[0].buildings);

  return <DataTable data={unitsAndBuildings} />;
};
