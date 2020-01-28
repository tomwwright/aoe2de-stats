import * as fs from "fs";
import _ from "lodash";
import { RawEmpiresDat, RawCivilization, RawCombatObject, RawBuildingObject, RawTech, RawResearch, RawBaseCombatObject } from "./raw-empires-dat";
import { EmpiresStrings } from "./empires-strings";

export type Unit = {
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
  attackType: string;
  attackBonuses: {
    [type: string]: number;
  };
  armours: {
    [type: string]: number;
  };
  blastRange: number;
  class: string;
  creationLocationId: number;
  creationTime: number;
  displayed: {
    attack: number;
    meleeArmour: number;
    pierceArmour: number;
    range: number;
  };
  flankAttackModifier: number;
  frameDelay: number;
  meleeArmour: number;
  pierceArmour: number;
  range: {
    minimum: number;
    maximum: number;
  };
  resourceCosts: {
    [type: string]: number;
  };
  rearAttackModifier: number;
};

export type Building = Unit & {
  garrisonType: number;
  garrisonHealRate: number;
  garrisonRepairRate: number;
};

export type Civilisation = {
  name: string;
  iconSetId: number;
  techTreeId: number;
  teamBonusId: number;
  units: Unit[];
  buildings: Building[];
};

export type Tech = {
  effects: TechEffect[];
  name: string;
};

export type TechEffect = DisabledTech | AttributeTechEffect | ResourceTechEffect | ToggleObjectTechEffect | UpgradeObjectTechEffect | TechTechEffect | DisableTechTechEffect;

type TechEffectType = TechEffect["type"];

type DisabledTech = {
  type: "DISABLED";
};

type AttributeTechEffect = {
  type: "ATTRIBUTE_ABSSET" | "ATTRIBUTE_RELSET" | "ATTRIBUTE_MUL" | "TEAM_ATTRIBUTE_ABSSET" | "TEAM_ATTRIBUTE_RELSET" | "TEAM_ATTRIBUTE_MUL";
  typeId: number;
  id: number;
  classId: number;
  attributeId: number;
  attributeClassId?: number;
  value: number;
};

type ResourceTechEffect = {
  type: "RESOURCE_MODIFY" | "RESOURCE_MUL" | "TEAM_RESOURCE_MODIFY" | "TEAM_RESOURCE_MUL";
  typeId: number;
  resourceId: number;
  isRelative: boolean;
  value: number;
};

type ToggleObjectTechEffect = {
  type: "OBJECT_TOGGLE" | "TEAM_OBJECT_TOGGLE";
  typeId: number;
  id: number;
  isEnabled: boolean;
};
type UpgradeObjectTechEffect = {
  type: "OBJECT_UPGRADE" | "TEAM_OBJECT_UPGRADE";
  typeId: number;
  oldId: number;
  newId: number;
};

type TechTechEffect = {
  type: "TECH_COST_MODIFY" | "TECH_TIME_MODIFY";
  typeId: number;
  id: number;
  attributeId: number;
  isRelative: boolean;
  value: number;
};

type DisableTechTechEffect = {
  type: "TECH_TOGGLE";
  typeId: number;
  id: number;
};

export type Research = {
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
    // armour class names from 124xx strings
    armourClassBaseMelee: 4,
    armourClassBasePierce: 3,
    armourClassLeitisAttack: 31,
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
    } as { [type: number]: string },
    techEffectTypes: {
      "-1": "DISABLED",
      0: "ATTRIBUTE_ABSSET",
      1: "RESOURCE_MODIFY",
      2: "OBJECT_TOGGLE",
      3: "OBJECT_UPGRADE",
      4: "ATTRIBUTE_RELSET",
      5: "ATTRIBUTE_MUL",
      6: "RESOURCE_MUL",
      10: "TEAM_ATTRIBUTE_ABSSET",
      11: "TEAM_RESOURCE_MODIFY",
      12: "TEAM_OBJECT_TOGGLE",
      13: "TEAM_OBJECT_UPGRADE",
      14: "TEAM_ATTRIBUTE_RELSET",
      15: "TEAM_ATTRIBUTE_MUL",
      16: "TEAM_RESOURCE_MUL",
      101: "TECH_COST_MODIFY",
      102: "TECH_TOGGLE",
      103: "TECH_TIME_MODIFY"
    } as { [type: number]: TechEffectType },
    // class names from 133xx strings
    unitClasses: {
      0: "Archer",
      1: "Artifact",
      2: "Trade Boat",
      3: "Building",
      4: "Civilian",
      5: "Ocean Fish",
      6: "Infantry",
      7: "Berry Bush",
      8: "Stone Mine",
      9: "Prey Animal",
      10: "Predator Animal",
      11: "Miscellaneous",
      12: "Cavalry",
      13: "Siege Weapon",
      14: "Terrain",
      15: "Tree",
      16: "Tree Stump",
      17: "Healer",
      18: "Monk",
      19: "Trade Cart",
      20: "Transport Boat",
      21: "Fishing Boat",
      22: "Warship",
      23: "Conquistador",
      24: "War Elephant",
      25: "Hero",
      26: "Elephant Archer",
      27: "Wall",
      28: "Phalanx",
      29: "Domestic Animal",
      30: "Flag",
      31: "Deep Sea Fish",
      32: "Gold Mine",
      33: "Shore Fish",
      34: "Cliff",
      35: "Petard",
      36: "Cavalry Archer",
      37: "Doppelganger",
      38: "Bird",
      39: "Gate",
      40: "Salvage Pile",
      41: "Resource Pile",
      42: "Relic",
      43: "Monk with Relic",
      44: "Hand Cannoneer",
      45: "Two Handed Swordsman",
      46: "Pikeman",
      47: "Scout",
      48: "Ore Mine",
      49: "Farm",
      50: "Spearman",
      51: "Packed Unit",
      52: "Tower",
      53: "Boarding Boat",
      54: "Unpacked Siege Unit",
      55: "Ballista",
      56: "Raider",
      57: "Cavalry Raider",
      58: "Livestock",
      59: "King",
      60: "Misc Building",
      61: "Controlled Animal"
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
      blastRange: raw.blastRange,
      class: this.lookups.unitClasses[raw.class],
      creationLocationId: raw.creationLocationId,
      creationTime: raw.creationTime,
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
      rearAttackModifier: raw.rearAttackModifier,
      ...this.parseAttacksAndArmours(raw)
    };

    return unit;
  }

  private parseAttacksAndArmours(raw: RawBaseCombatObject) {
    const rawAttacksMap = raw.attacks.reduce((obj, v) => {
      obj[v.type] = v.amount;
      return obj;
    }, {} as { [type: number]: number });

    const rawArmoursMap = raw.armors.reduce((obj, v) => {
      obj[v.type] = v.amount;
      return obj;
    }, {} as { [type: number]: number });

    return {
      armours: _.fromPairs(
        Object.entries(rawArmoursMap)
          .filter(
            armour =>
              armour[0] !== this.lookups.armourClassBasePierce.toString() && armour[0] !== this.lookups.armourClassBaseMelee.toString() && armour[0] !== this.lookups.armourClassLeitisAttack.toString()
          )
          .map(armour => [this.lookups.armourClasses[Number.parseInt(armour[0])], armour[1]])
      ),
      attackType: Object.keys(rawAttacksMap).includes(this.lookups.armourClassBasePierce.toString()) ? "PIERCE" : "MELEE",
      attack: rawAttacksMap[this.lookups.armourClassBasePierce] || rawAttacksMap[this.lookups.armourClassBaseMelee],
      attackBonuses: _.fromPairs(
        Object.entries(rawAttacksMap)
          .filter(attack => attack[0] !== this.lookups.armourClassBasePierce.toString() && attack[0] !== this.lookups.armourClassBaseMelee.toString())
          .map(attack => [this.lookups.armourClasses[Number.parseInt(attack[0])], attack[1]])
      ),
      meleeArmour: rawArmoursMap[this.lookups.armourClassBaseMelee],
      pierceArmour: rawArmoursMap[this.lookups.armourClassBasePierce]
    };
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
      effects: raw.effects.map(rawEffect => this.parseTechEffect(rawEffect))
    };
  }

  private parseTechEffect(raw: RawTech["effects"][number]): TechEffect {
    const typeId = raw.type;
    const type: any = this.lookups.techEffectTypes[raw.type];
    if ([0, 4, 5, 10, 14, 15].includes(typeId)) {
      // attribute effects
      const effect = {
        type,
        typeId,
        id: raw.unit,
        classId: raw.unitClassId,
        attributeId: raw.attributeId,
        value: raw.amount
      };
      if (effect.attributeId == 8 || effect.attributeId == 9) {
        return {
          ...effect,
          ...this.parseTechEffectAttributeValue(effect.value)
        };
      } else {
        return effect;
      }
    } else if ([1, 6, 11, 16].includes(typeId)) {
      // resource effects
      return {
        type,
        typeId,
        resourceId: raw.unit,
        isRelative: raw.unitClassId == 1,
        value: raw.amount
      };
    } else if ([2, 12].includes(typeId)) {
      // toggle object effect
      return {
        type,
        typeId,
        id: raw.unit,
        isEnabled: raw.unitClassId == 1
      };
      // upgrade object effect
    } else if ([3, 13].includes(typeId)) {
      return {
        type,
        typeId,
        oldId: raw.unit,
        newId: raw.unitClassId
      };
    } else if ([101, 103].includes(typeId)) {
      // tech effect
      return {
        type,
        typeId,
        attributeId: raw.unit,
        isRelative: raw.attributeId == 1,
        value: raw.amount
      };
    } else if (typeId == 102) {
      // disable tech effect
      return {
        type,
        typeId,
        id: raw.amount
      };
    }

    return {
      type,
      typeId
    };
  }

  private parseTechEffectAttributeValue(value: number) {
    let attributeClassId = 0;
    while (value > 256) {
      attributeClassId += 1;
      value -= 256;
    }

    return {
      attributeClassId,
      value
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
