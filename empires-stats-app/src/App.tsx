import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Button } from "@material-ui/core";
import { EmpiresDatProvider } from "./EmpiresDatContext";
import { CivilisationList } from "./CivilisationList";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <EmpiresDatProvider>
          <Button variant="contained">test</Button>
          <CivilisationList />
        </EmpiresDatProvider>
      </header>
    </div>
  );
};

export default App;
