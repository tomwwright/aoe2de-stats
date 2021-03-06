import React from "react";
import "./App.css";

import { Button } from "@material-ui/core";
import { BrowserRouter, Link as RouterLink, Route, Switch } from "react-router-dom";
import { EmpiresDatProvider } from "./EmpiresDatContext";
import { CivilisationList } from "./CivilisationList";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { TechList } from "./TechList";
import { ResearchList } from "./ResearchList";
import { UnitAndBuildingList } from "./UnitAndBuildingList";
import { UnitsTable } from "./UnitsTable";
import { ResearchTable } from "./ResearchTable";
import { TechsTable } from "./TechsTable";

const App: React.FC = () => {
  return (
    <EmpiresDatProvider>
      <BrowserRouter>
        <Button color="primary" variant="contained" component={RouterLink} to="/units">
          Units
        </Button>
        <Button color="primary" variant="contained" component={RouterLink} to="/rawunitsbuildings">
          Raw Units and Buildings
        </Button>
        <Button color="primary" variant="contained" component={RouterLink} to="/civilisations">
          Civilisations
        </Button>
        <Button color="primary" variant="contained" component={RouterLink} to="/techs">
          Techs
        </Button>
        <Button color="primary" variant="contained" component={RouterLink} to="/rawtechs">
          Raw Techs
        </Button>
        <Button color="primary" variant="contained" component={RouterLink} to="/researches">
          Researches
        </Button>
        <Button color="primary" variant="contained" component={RouterLink} to="/rawresearches">
          Raw Researches
        </Button>
        <Switch>
          <Route path="/units">
            <UnitsTable />
          </Route>
          <Route path="/rawunitsbuildings">
            <UnitAndBuildingList />
          </Route>
          <Route path="/civilisations">
            <CivilisationList />
          </Route>
          <Route path="/techs">
            <TechsTable />
          </Route>
          <Route path="/rawtechs">
            <TechList />
          </Route>
          <Route path="/researches">
            <ResearchTable />
          </Route>
          <Route path="/rawresearches">
            <ResearchList />
          </Route>
        </Switch>
      </BrowserRouter>
    </EmpiresDatProvider>
  );
};

export default App;
