import * as fs from "fs";
import { RawEmpiresDat, RawCivilization, RawCombatObject, RawBuildingObject, RawTech, RawResearch } from "./raw-empires-dat";
import { EmpiresStrings } from "./empires-strings";

type Unit = {
  id: number;
  type: number;
  name: string;
  hitPoints: number;
  lineOfSight: number;
  garrisonCapacity: number;
  speed: number;
  turnSpeed: number;
  turnRadius: number;
  turnRadiusSpeed: number;
  accuracyDispersion: number;
  attackSpeed: number;
  attacks: {
    [type: string]: number;
  };
  armours: {
    [type: string]: number;
  };
  blastRange: number;
  displayed: {
    attack: number;
    meleeArmour: number;
    pierceArmour: number;
    range: number;
  };
  flankAttackModifier: number;
  frameDelay: number;
  range: {
    minimum: number;
    maximum: number;
  };
  resourceCosts: {
    [type: string]: number;
  };
  rearAttackModifier: number;
};

type Building = Unit & {
  garrisonType: number;
  garrisonHealRate: number;
  garrisonRepairRate: number;
};

type Civilisation = {
  name: string;
  iconSetId: number;
  techTreeId: number;
  teamBonusId: number;
  units: Unit[];
  buildings: Building[];
};

type Tech = {
  effects: {
    type: number;
    unit: number;
    unitClassId: number;
    attributeId: number;
    amount: number;
  }[];
  name: string;
};

type Research = {
  civilisationId: number;
  internalName: string;
  name: string;
  researchLocationId: number;
  researchTime: number;
  resourceCosts: {
    [type: string]: number;
  };
  techId: number;
};

export type EmpiresDat = {
  civilisations: Civilisation[];
  techs: Tech[];
  researches: Research[];
};

export class Parser {
  private strings: { [id: string]: string };

  private lookups = {
    resourceTypes: {
      0: "FOOD",
      1: "WOOD",
      2: "STONE",
      3: "GOLD",
      4: "POPULATION"
    } as { [type: number]: string },
    armourClasses: {
      1: "Infantry",
      2: "Turtle Ships",
      3: "Base Pierce",
      4: "Base Melee",
      5: "War Elephants",
      8: "Cavalry",
      11: "All Buildings",
      13: "Stone Defense",
      14: "Predator Animals",
      15: "Archers",
      16: "Ships and Saboteurs",
      17: "Rams",
      18: "Trees",
      19: "Unique Units",
      20: "Siege Weapons",
      21: "Standard Buildings",
      22: "Walls and Gates",
      23: "Gunpowder Units",
      24: "Boars",
      25: "Monks",
      26: "Castles",
      27: "Spearmen",
      28: "Cavalry Archers",
      29: "Eagle Warriors",
      30: "Camels",
      31: "Leitis attack",
      32: "Condottieri",
      33: "Organ Gun Projectiles",
      34: "Fishing Ships",
      35: "Mamelukes",
      36: "Heroes & Kings"
    } as { [type: number]: string }
  };

  constructor(strings: { [id: string]: string }) {
    this.strings = strings;
  }

  parse(data: RawEmpiresDat): EmpiresDat {
    const parsed = {
      civilisations: [] as Civilisation[],
      techs: [] as Tech[],
      researches: [] as Research[]
    };

    for (const raw of data.civilizations) {
      parsed.civilisations.push(this.parseCivilisation(raw));
    }

    for (const raw of data.techs) {
      parsed.techs.push(this.parseTech(raw));
    }

    for (const raw of data.researches) {
      parsed.researches.push(this.parseResearch(raw));
    }

    return parsed;
  }

  private parseCivilisation(raw: RawCivilization): Civilisation {
    const civ = {
      name: raw.name.value,
      iconSetId: raw.iconSet,
      techTreeId: raw.techTreeId,
      teamBonusId: raw.teamBonusId,
      units: raw.objects.filter(obj => obj.type == 70).map(obj => this.parseUnit(obj as RawCombatObject)),
      buildings: raw.objects.filter(obj => obj.type == 80).map(obj => this.parseBuilding(obj as RawBuildingObject))
    };

    return civ;
  }

  private parseUnit(raw: RawCombatObject): Unit {
    const unit = {
      id: raw.id,
      type: raw.type,
      name: this.strings[raw.languageDllName],
      hitPoints: raw.hitPoints,
      lineOfSight: raw.lineOfSight,
      garrisonCapacity: raw.garrisonCapacity,
      speed: raw.speed,
      turnSpeed: raw.turnSpeed,
      turnRadius: raw.turnRadiusSpeed,
      turnRadiusSpeed: raw.turnRadiusSpeed,
      accuracyDispersion: raw.accuracyDispersion,
      attackSpeed: raw.attackSpeed,
      attacks: raw.attacks.reduce((obj, v) => {
        obj[this.lookups.armourClasses[v.type]] = v.amount;
        return obj;
      }, {} as { [type: string]: number }),
      armours: raw.armors.reduce((obj, v) => {
        obj[this.lookups.armourClasses[v.type]] = v.amount;
        return obj;
      }, {} as { [type: string]: number }),
      blastRange: raw.blastRange,
      displayed: {
        attack: raw.attackDisplayed,
        meleeArmour: raw.meleeArmorDisplayed,
        pierceArmour: raw.pierceArmorDisplayed,
        range: raw.rangeDisplayed
      },
      flankAttackModifier: raw.flankAttackModifier,
      frameDelay: raw.frameDelay,
      range: {
        minimum: raw.weaponRangeMin,
        maximum: raw.weaponRangeMax
      },
      resourceCosts: raw.resourceCost
        .filter(r => r.enabled)
        .reduce((obj, v) => {
          obj[this.lookups.resourceTypes[v.type]] = v.amount;
          return obj;
        }, {} as { [type: string]: number }),
      rearAttackModifier: raw.rearAttackModifier
    };

    return unit;
  }

  private parseBuilding(raw: RawBuildingObject): Building {
    const unit = this.parseUnit(raw);

    const building = {
      ...unit,
      garrisonType: raw.garrisonType,
      garrisonHealRate: raw.garrisonHealRate,
      garrisonRepairRate: raw.garrisonRepairRate
    };

    return building;
  }

  private parseTech(raw: RawTech): Tech {
    return {
      name: raw.name.value,
      effects: raw.effects
    };
  }

  private parseResearch(raw: RawResearch): Research {
    return {
      civilisationId: raw.civilizationId,
      internalName: raw.name.value,
      name: this.strings[raw.languageDllName],
      researchLocationId: raw.researchLocationId,
      researchTime: raw.researchTime,
      resourceCosts: raw.resourceCosts
        .filter(r => r.enabled)
        .reduce((obj, v) => {
          obj[this.lookups.resourceTypes[v.resourceId]] = v.amount;
          return obj;
        }, {} as { [type: string]: number }),
      techId: raw.techEffectId
    };
  }
}

// main
if (require.main === module) {
  console.log("== Age of Empires 2: Definitive Edition raw data parser ==");
  const inputDatFilename = process.argv[2] || "dat/empires2_x2_p1.dat.json";
  const inputStringsFilename = process.argv[3] || "dat/empires-strings.json";
  const outputFilename = process.argv[4] || "dat/empires-dat.json";

  console.log(`Input Dat: ${inputDatFilename}\nInput Strings: ${inputStringsFilename}\nOutput: ${outputFilename}`);

  const rawEmpiresDat: RawEmpiresDat = JSON.parse(fs.readFileSync(inputDatFilename).toString());
  const empiresStrings: EmpiresStrings = JSON.parse(fs.readFileSync(inputStringsFilename).toString());

  const parser = new Parser(empiresStrings.strings);

  const empiresDat = parser.parse(rawEmpiresDat);

  console.log(`Civilisations: ${empiresDat.civilisations.length}`);
  console.log(`Techs: ${empiresDat.techs.length}`);
  console.log(`Researches: ${empiresDat.researches.length}`);

  fs.writeFileSync(outputFilename, JSON.stringify(empiresDat));
}
