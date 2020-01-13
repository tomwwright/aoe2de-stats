import React, { useContext } from "react";

import { EmpiresDatContext } from "./EmpiresDatContext";
import { DataTable } from "./DataTable";
import { Tech } from "../../empires-dat/src/empires-dat";

export const TechList: React.StatelessComponent<{}> = () => {
  const empires = useContext(EmpiresDatContext);

  const denormalisedTechs = denormaliseByEffects(empires.techs);

  return <DataTable data={denormalisedTechs} />;
};

const denormaliseByEffects = (techs: Tech[]) => {
  return techs.flatMap((tech, i) =>
    tech.effects.map(effect => ({
      techId: i,
      name: tech.name,
      ...effect
    }))
  );
};
