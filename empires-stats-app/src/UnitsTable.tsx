import React, { useContext } from "react";

import { EmpiresDatContext } from "./EmpiresDatContext";
import { EmpiresDat } from "../../empires-dat/src/empires-dat";
import { Table } from "./Table";
import { formatNumber } from "./Formatters/Number";

import { ColDef } from "ag-grid-community";

export const UnitsTable: React.StatelessComponent<{}> = () => {
  const empires = useContext(EmpiresDatContext);

  const unitsData = constructUnitsTableData(empires);

  const columns: ColDef[] = [
    { headerName: "Name", field: "name", sortable: true, filter: true, resizable: true },
    { headerName: "Produced at", field: "building.name", sortable: true, filter: true, resizable: true },
    { headerName: "Cost", field: "formatted.costs", sortable: true, filter: true, resizable: true },
    { headerName: "Food", field: "resourceCosts.FOOD", sortable: true, filter: true, resizable: true },
    { headerName: "Wood", field: "resourceCosts.WOOD", sortable: true, filter: true, resizable: true },
    { headerName: "Gold", field: "resourceCosts.GOLD", sortable: true, filter: true, resizable: true },
    { headerName: "Stone", field: "resourceCosts.STONE", sortable: true, filter: true, resizable: true },
    { headerName: "Pop.", field: "resourceCosts.POPULATION", sortable: true, filter: true, resizable: true },
    { headerName: "Health", field: "hitPoints", sortable: true, filter: true, resizable: true },
    { headerName: "Speed", field: "speed", valueFormatter: formatNumber, sortable: true, filter: true, resizable: true },
    { headerName: "Min. Range", field: "range.minimum", sortable: true, filter: true, resizable: true },
    { headerName: "Max. Range", field: "range.maximum", sortable: true, filter: true, resizable: true },
    { headerName: "Attack Type", field: "attackType", sortable: true, filter: true, resizable: true },
    { headerName: "Attack", field: "attack", sortable: true, filter: true, resizable: true },
    { headerName: "Attack Bonuses", field: "formatted.attackBonuses", sortable: true, filter: true, resizable: true },
    { headerName: "Armour (Melee)", field: "meleeArmour", sortable: true, filter: true, resizable: true },
    { headerName: "Armour (Pierce)", field: "pierceArmour", sortable: true, filter: true, resizable: true },
    { headerName: "Armour Types", field: "formatted.armours", sortable: true, filter: true, resizable: true },
    { headerName: "Class", field: "class", sortable: true, filter: true, resizable: true }
  ];

  return <Table columnDefs={columns} rowData={unitsData} />;
};

const constructUnitsTableData = (empires: EmpiresDat) => {
  if (empires.civilisations.length === 0) return [];

  const buildings = empires.civilisations[0].buildings;
  const units = empires.civilisations[0].units;

  return units.map(unit => ({
    ...unit,
    building: buildings.find(building => building.id === unit.creationLocationId),
    formatted: {
      costs: Object.entries(unit.resourceCosts)
        .map(cost => `${cost[1]} ${cost[0]}`)
        .join(", "),
      armours: Object.entries(unit.armours)
        .sort((a, b) => b[1] - a[1])
        .map(armour => `${armour[0]}${armour[1] > 0 ? ` (+${armour[1]})` : ""}`)
        .join(", "),
      attackBonuses: Object.entries(unit.attackBonuses)
        .sort((a, b) => b[1] - a[1])
        .map(attack => `+${attack[1]} ${attack[0]}`)
        .join(", ")
    }
  }));
};
