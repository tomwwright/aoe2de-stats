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
        <Button color="primary" variant="contained" component={RouterLink} to="/researches">
          Researches
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
            <TechList />
          </Route>
          <Route path="/researches">
            <ResearchList />
          </Route>
        </Switch>
      </BrowserRouter>
    </EmpiresDatProvider>
  );
};

export default App;
