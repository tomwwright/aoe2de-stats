import React, { useContext } from "react";

import { EmpiresDatContext } from "./EmpiresDatContext";
import { EmpiresDat, TechEffect } from "../../empires-dat/src/empires-dat";
import { Table } from "./Table";

import { ColDef } from "ag-grid-community";

export const TechsTable: React.StatelessComponent<{}> = () => {
  const empires = useContext(EmpiresDatContext);

  const techsData = constructTechsTableData(empires);

  const columns: ColDef[] = [
    { headerName: "ID", field: "techId", sortable: true, filter: true, resizable: true },
    { headerName: "Name", field: "name", sortable: true, filter: true, resizable: true },
    { headerName: "Type", field: "type", sortable: true, filter: true, resizable: true },
    { headerName: "Effect", field: "effect", sortable: true, filter: true, resizable: true }
  ];

  return <Table columnDefs={columns} rowData={techsData} />;
};

const constructTechsTableData = (empires: EmpiresDat) => {
  return empires.techs.flatMap((tech, i) =>
    tech.effects.map(effect => ({
      techId: i,
      name: tech.name,
      type: effect.type,
      effect: makeTechDescription(empires, effect)
    }))
  );
};

const makeTechDescription = (empires: EmpiresDat, tech: TechEffect): string => {
  switch (tech.type) {
    case "TECH_TOGGLE":
      return `Disable ${empires.researches[tech.id] ? empires.researches[tech.id].internalName : JSON.stringify(tech)}`;
    case "ATTRIBUTE_RELSET":
      return `${tech.value > 0 ? "+" : "-"}${Math.abs(tech.value)} attribute ${tech.attributeId} ${tech.attributeClassId !== undefined ? `(class ${tech.attributeClassId})` : ""} for ${
        tech.classId !== -1 ? `Class ${tech.classId}` : `Object ${tech.id}`
      }`;
    default:
      return `${tech.type}: ${JSON.stringify(tech)}`;
  }
};
