import React, { Component } from "react";
import { EmpiresDat } from "../../empires-dat/src/empires-dat";

const defaultEmpiresDat: EmpiresDat = {
  civilisations: [],
  techs: [],
  researches: []
};

export const EmpiresDatContext = React.createContext(defaultEmpiresDat);

export class EmpiresDatProvider extends Component<{}, EmpiresDat> {
  constructor(props: {}) {
    super(props);

    this.state = defaultEmpiresDat;
  }

  async componentDidMount() {
    const empires = await this.loadEmpiresDat();

    this.setState(empires);
  }

  private async loadEmpiresDat(): Promise<EmpiresDat> {
    const response = await (await fetch("/empires-dat.json")).json();

    return response as EmpiresDat;
  }

  render() {
    const { children } = this.props;

    return <EmpiresDatContext.Provider value={this.state}>{children}</EmpiresDatContext.Provider>;
  }
}
