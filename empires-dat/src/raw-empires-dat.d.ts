// types to represent output files of https://github.com/tomwwright/genie-dat

export type RawEmpiresDat = {
  fileVersion: number;
  terrainRestrictionCount: number;
  terrainCount: number;
  terrainTables: number[];
  terrainPassGraphicPointers: number[];
  terrainRestrictions: object[];
  playerColors: object[];
  sounds: object[];
  graphicCount: number;
  graphicPtrs: number[];
  graphics: object[];
  "RGE_Map::vfptr": number;
  mapPointer: number;
  mapWidth: number;
  mapHeight: number;
  worldWidth: number;
  worldHeight: number;
  tileSizes: object[];
  padding1: number;
  terrains: object[];
  mapMinX: number;
  mapMinY: number;
  mapMaxX: number;
  mapMaxY: number;
  "mapMaxX+1": number;
  "mapMaxY+1": number;
  additionalTerrainCount: number;
  bordersUsed: number;
  maxTerrain: number;
  tileWidth: number;
  tileHeight: number;
  tileHalfWidth: number;
  tileHalfHeight: number;
  elevHeight: number;
  currentRow: number;
  currentColumn: number;
  blockBeginRow: number;
  blockEndRow: number;
  blockBeginColumn: number;
  blockEndColumn: number;
  searchMapPointer: number;
  searchMapRowsPointer: number;
  anyFrameChange: number;
  mapVisibleFlag: number;
  fogFlag: number;
  randomMapCount: number;
  randomMapPointer: number;
  randomMapInfo: object[];
  randomMaps: object[];
  techs: object[];
  objectHeaders: object[];
  civilizations: RawCivilization[];
  researches: object[];
  timeSlice: number;
  unitKillRate: number;
  unitKillTotal: number;
  unitHitPointRate: number;
  unitHitPointTotal: number;
  razingKillRate: number;
  razingKillTotal: number;
  techTree: object[];
};

type RawCivilization = {
  playerType: number;
  name: {
    value: string;
  };
  resourcesCount: number;
  techTreeId: number;
  teamBonusId: number;
  resources: number[];
  iconSet: number;
  objectCount: number;
  objectOffsets: number[];
  objects: Array<RawStaticObject | RawAnimatedObject | RawDoppelgangerObject | RawMovingObject | RawMissileObject | RawCombatObject | RawBuildingObject>;
};

type RawStaticObject = {
  type: number;
  id: number;
  languageDllName: number;
  languageDllCreation: number;
  class: number;
  standingGraphic0: number;
  standingGraphic1: number;
  dyingGraphic: number;
  undeadGraphic: number;
  deathMode: number;
  hitPoints: number;
  lineOfSight: number;
  garrisonCapacity: number;
  radius: {
    x: number;
    y: number;
    z: number;
  };
  trainSound: number;
  damageSound: number;
  deadUnitId: number;
  bloodUnitId: number;
  placementMode: number;
  canBeBuiltOn: number;
  iconId: number;
  hiddenInEditor: number;
  oldPortraitIconId: number;
  enabled: boolean;
  disabled: boolean;
  placementSideTerrain0: number;
  placementSideTerrain1: number;
  placementTerrain0: number;
  placementTerrain1: number;
  clearanceSize: {
    x: number;
    y: number;
  };
  buildingMode: number;
  visibleInFog: number;
  terrainRestriction: number;
  flyMode: number;
  resourceCapacity: number;
  resourceDecay: number;
  blastDefenseLevel: number;
  combatLevel: number;
  interactionMode: number;
  mapDrawLevel: number;
  unitLevel: number;
  attackReaction: number;
  minimapColor: number;
  languageDllHelp: number;
  languageDllHotkeyText: number;
  hotkeyId: number;
  recycleable: number;
  enableAutoGather: number;
  doppelgangerOnDeath: number;
  resourceGatherDrop: number;
  occlusionMask: number;
  obstructionType: number;
  obstructionClass: number;
  flags: number;
  drawFlag: number;
  drawColor: number;
  outlineRadius: {
    x: number;
    y: number;
    z: number;
  };
  scenarioTrigger1: number;
  scenarioTrigger2: number;
  resourceStorage: {
    type: number;
    amount: number;
    usedMode: number;
  }[];
  damageGraphics: {
    graphicId: number;
    damagePercent: number;
    flag: number;
  }[];
  selectionSound: number;
  dyingSound: number;
  wwiseTrainSoundId: number;
  wwiseDamageSoundId: number;
  wwiseSelectionSoundId: number;
  wwiseDyingSoundId: number;
  oldAttackMode: number;
  convertTerrain: number;
  name: number;
  copyId: number;
  baseId: number;
};

type RawAnimatedObject = RawStaticObject & {
  speed: number;
};

type RawDoppelgangerObject = RawAnimatedObject;

type RawMovingObject = RawAnimatedObject & {
  walkingGraphics0: number;
  walkingGraphics1: number;
  turnSpeed: number;
  oldSizeClass: number;
  trailObjectId: number;
  trailOptions: number;
  trailSpacing: number;
  oldMoveAlgorithm: number;
  turnRadius: number;
  turnRadiusSpeed: number;
  maxYawPerSecondMoving: number;
  stationaryYawRevolutionTime: number;
  maxYawPerSecondStationary: number;
  minCollisionSizeMultiplier: number;
};

type RawActionObject = RawMovingObject & {
  defaultTaskId: number;
  searchRadius: number;
  workRate: number;
  dropSite0: number;
  dropSite1: number;
  taskByGroup: number;
  commandSoundId: number;
  stopSoundId: number;
  wwiseCommandSoundId: number;
  wwiseStopSoundId: number;
  runPattern: number;
};

type RawBaseCombatObject = RawActionObject & {
  defaultArmor: number;
  attacks: {
    type: number;
    amount: number;
  }[];
  armors: {
    type: number;
    amount: number;
  }[];
  boundaryId: number;
  weaponRangeMax: number;
  blastRange: number;
  attackSpeed: number;
  projectileObjectId: number;
  baseHitChance: number;
  breakOffCombat: number;
  frameDelay: number;
  weaponOffset: {
    x: number;
    y: number;
    z: number;
  };
  blastLevelOffense: number;
  weaponRangeMin: number;
  accuracyDispersion: number;
  fightSpriteId: number;
  meleeArmorDisplayed: number;
  attackDisplayed: number;
  rangeDisplayed: number;
  reloadTimeDisplayed: number;
};

type RawMissileObject = RawBaseCombatObject & {
  projectileType: number;
  smartMode: number;
  dropAnimationMode: number;
  penetrationMode: number;
  areaOfEffectSpecial: number;
  projectileArc: number;
};

type RawCombatObject = RawBaseCombatObject & {
  resourceCost: {
    type: number;
    amount: number;
    enabled: number;
  }[];
  creationTime: number;
  creationLocationId: number;
  creationButtonId: number;
  rearAttackModifier: number;
  flankAttackModifier: number;
  creatableType: number;
  heroMode: number;
  garrisonGraphic: number;
  spawningGraphic: number;
  upgradeGraphic: number;
  volleyFireAmount: number;
  maxAttacksInVolley: number;
  volleyXSpread: number;
  volleyYSpread: number;
  volleyStartSpreadAdjustment: number;
  volleyMissileId: number;
  specialGraphicid: number;
  specialActivation: number;
  pierceArmorDisplayed: number;
};

type RawBuildingObject = RawCombatObject & {
  constructionGraphicId: number;
  snowGraphicId: number;
  destructionGraphicId: number;
  destructionRubbleGraphicId: number;
  researchingGraphicId: number;
  researchCompletedGraphicId: number;
  adjacentMode: number;
  graphicsAngle: number;
  disappearsWhenBuilt: number;
  stackUnitId: number;
  foundationTerrainId: number;
  oldOverlayId: number;
  researchId: number;
  canBurn: number;
  annexes: {
    objectId: number;
    misplaced0: number;
    misplaced1: number;
  }[];
  headObjectId: number;
  transformObjectId: number;
  transformSoundId: number;
  constructionSoundId: number;
  wwiseTransformSoundId: number;
  wwiseConstructionSoundId: number;
  garrisonType: number;
  garrisonHealRate: number;
  garrisonRepairRate: number;
  salvageObjectId: number;
  salvageAttributes: number[];
};
