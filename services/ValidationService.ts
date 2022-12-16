import { ListState } from "../data/listSlice";
import _ from "lodash";
import { ArmyState } from "../data/armySlice";
import UpgradeService from "./UpgradeService";
import UnitService from "./UnitService";

const unitPointThresholds = {
  "gf": 200,
  "gff": 30,
  "aof": 165,
  "aofr": 165,
  "aofs": 25,
};
const heroPointThresholds = {
  "gf": 500,
  "gff": 150,
  "aof": 500,
  "aofr": 500,
  "aofs": 150,
};
const duplicateUnitThresholds = {
  "gf": 1000,
  "gff": 150,
  "aof": 1000,
  "aofr": 1000,
  "aofs": 150,
};

export default class ValidationService {

  public static getErrors(army: ArmyState, list: ListState): string[] {

    if (!army || !list)
      return [];

    const errors = [];

    if (list.pointsLimit > 0 && list.points > list.pointsLimit)
      errors.push(`Points limit exceeded: ${list.points}/${list.pointsLimit}`)

    const system = army.gameSystem;
    const points = list.pointsLimit || list.points;

    const units = list.units;
    const unitCount = units.filter(u => !u.joinToUnit).length;
    const heroes = units.filter(u => u.specialRules.some(rule => rule.name === "Hero"))
    const heroCount = heroes.length;
    const joinedHeroes = heroes.filter(u => (u.joinToUnit && units.some(t => t.selectionId === u.joinToUnit)))
    const joinedIds = joinedHeroes.map(u => u.joinToUnit);
    const duplicateUnitLimit = 1 + Math.floor((points / duplicateUnitThresholds[system]));
    const nonCombinedUnitsGrouped = _.groupBy(units.filter(u => !(u.combined && (!u.joinToUnit))), u => u.id);
    const unitsOverDuplicateLimit = Object
      .keys(nonCombinedUnitsGrouped)
      .map(key => ({
        unitName: units.find(u => u.id === key).name,
        count: nonCombinedUnitsGrouped[key].length
      }))
      .filter((grp) => grp.count > duplicateUnitLimit);

    const fullUnits = UnitService.getFullUnitList(units, false);
    const maxAllowedSingleUnit = points * 0.3333;

    //#region All Game Systems

    if (heroCount > Math.floor(points / heroPointThresholds[system]))
      errors.push(`Max 1 hero per full ${heroPointThresholds[system]}pts.`);

    if (unitCount > Math.floor(points / unitPointThresholds[system])) {
      const combinedMsg = system === "gf" || system === "aof" || system === "aofr"
        ? ` (combined units count as just 1 unit)`
        : "";
      errors.push(`Max 1 unit per full ${unitPointThresholds[system]}pts${combinedMsg}.`);
    }

    if (unitsOverDuplicateLimit.length > 0)
      errors.push(`Cannot have more than ${duplicateUnitLimit} copies of a particular unit (${unitsOverDuplicateLimit.map(x => x.unitName).join(", ")}).`); // combined units still count as one

    if (fullUnits.some(u => u.unitPointsAll > maxAllowedSingleUnit))
      errors.push("May not bring any single unit worth more than 33% of total points.");

    //#endregion

    /*
    all games - "Players may not bring any single unit worth more than 33% of their total points."
    skirmish games - "Players must configure their lists so that they only have a max. of 1 model in play per full 20pts in their list."
    for battle games: "Example: For a 2000pts game, you can take max. 4 heroes, max. 3 copies of each unit, no unit worth over 660pts, and max. 10 units in total."
    for skirmish games: "Example: For a 300pts game, you can take max. 2 heroes, max. 3 copies of each unit, no unit worth over 99pts, max. 10 units in total, and max. 15 models."
     */

    const isBattleSystem = army.gameSystem === "gf" || army.gameSystem === "aof" || army.gameSystem === "aofr";
    const isSkirmishSystem = army.gameSystem === "gff" || army.gameSystem === "aofs";


    if (isBattleSystem) {

      if (units.some(u => u.combined && u.size === 1))
        errors.push(`Cannot combine units of unit size [1].`);

      if (units.some(u => u.size === 1 && joinedIds.includes(u.selectionId)))
        errors.push(`Heroes cannot join units that only contain a single model.`);

      if (new Set(joinedIds).size < joinedIds.length)
        errors.push(`A unit can only have a maximum of one Hero attached.`);

      if (joinedHeroes.some(hero => list.units.find(unit => unit.selectionId === hero.joinToUnit).armyId !== hero.armyId))
        errors.push(`Heroes only join units from their own faction.`);
    } else if (isSkirmishSystem) {

      // 1 model per full 20pts
      const modelCount = _.sumBy(units, u => u.size);
      const modelLimit = Math.floor(points / 20);
      if (modelCount > Math.floor(points / 20))
        errors.push(`Max 1 model per full 20pts. Maximum valid number of models is ${modelLimit}, current total is ${modelCount}.`);
    }

    if (army.gameSystem === "aofs") {

      // Rule: When preparing your army you may only have one model with one of the following upgrades (across the entire army).
      const sergeants = units.filter(u => u.selectedUpgrades.some(upgrade => upgrade.option.label === "Sergeant"));
      const sergeantsCount = sergeants.length;
      const musicians = units.filter(u => u.selectedUpgrades.some(upgrade => upgrade.option.label === "Musician"));
      const musiciansCount = musicians.length;
      const battleStandards = units.filter(u => u.selectedUpgrades.some(upgrade => upgrade.option.label === "Battle Standard"));
      const battleStandrdsCount = battleStandards.length;

      if (sergeantsCount + musiciansCount + battleStandrdsCount > 1) {
        errors.push(`Max 1 of the following upgrades per army (not one of each!): Sergeant, Musician or Battle Standard.`);
      }
    }

    if (army.loadedArmyBooks.length > 2) {
      errors.push("Players may bring units from up to two factions in the same list.")
    }

    const unitsByArmy = _.groupBy(units, x => x.armyId);
    const pointsByArmy = Object.keys(unitsByArmy)
      .map((key) => unitsByArmy[key]
        .reduce((pts, unit) => pts + UpgradeService.calculateUnitTotal(unit), 0));

    if (list.points > 0 && army.loadedArmyBooks.length > 1 && !pointsByArmy.some(x => (x / points * 100) >= 60)) {
      errors.push("Mixed armies must consist of at least 60% worth of units from their primary faction.");
    }

    return errors;
  }
}