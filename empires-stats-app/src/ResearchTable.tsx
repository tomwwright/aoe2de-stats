import React, { useContext } from "react";

import { EmpiresDatContext } from "./EmpiresDatContext";
import { EmpiresDat } from "../../empires-dat/src/empires-dat";
import { Table } from "./Table";

import { ColDef } from "ag-grid-community";

export const ResearchTable: React.StatelessComponent<{}> = () => {
  const empires = useContext(EmpiresDatContext);

  const researchData = constructResearchTableData(empires);

  const columns: ColDef[] = [
    { headerName: "Name", field: "name", sortable: true, filter: true, resizable: true },
    { headerName: "Civilisation", field: "civilisation.name", sortable: true, filter: true, resizable: true },
    { headerName: "Researched at", field: "building.name", sortable: true, filter: true, resizable: true },
    { headerName: "Cost", field: "formatted.costs", sortable: true, filter: true, resizable: true },
    { headerName: "Food", field: "resourceCosts.FOOD", sortable: true, filter: true, resizable: true },
    { headerName: "Wood", field: "resourceCosts.WOOD", sortable: true, filter: true, resizable: true },
    { headerName: "Gold", field: "resourceCosts.GOLD", sortable: true, filter: true, resizable: true },
    { headerName: "Stone", field: "resourceCosts.STONE", sortable: true, filter: true, resizable: true },
    { headerName: "Research Time", field: "researchTime", sortable: true, filter: true, resizable: true }
  ];

  return <Table columnDefs={columns} rowData={researchData} />;
};

const constructResearchTableData = (empires: EmpiresDat) => {
  if (empires.civilisations.length === 0) return [];

  const buildings = empires.civilisations[0].buildings;
  const civilisations = empires.civilisations;
  const researches = empires.researches;

  return researches
    .filter(research => research.name !== undefined && research.name !== "" && research.researchLocationId > 0)
    .map(research => ({
      ...research,
      building: buildings.find(building => building.id === research.researchLocationId),
      civilisation: research.civilisationId ? civilisations[research.civilisationId] : null,
      formatted: {
        costs: Object.entries(research.resourceCosts)
          .map(cost => `${cost[1]} ${cost[0]}`)
          .join(", ")
      }
    }));
};
