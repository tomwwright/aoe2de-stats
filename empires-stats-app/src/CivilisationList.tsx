import React, { useContext } from "react";

import { EmpiresDatContext } from "./EmpiresDatContext";

export const CivilisationList: React.StatelessComponent<{}> = () => {
  const empires = useContext(EmpiresDatContext);

  return (
    <div>
      {empires.civilisations.map(civ => (
        <p key={civ.name}>{civ.name}</p>
      ))}
    </div>
  );
};
