import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../data/store";
import { TableContainer, Table, TableRow, TableCell, TableHead, Typography } from "@mui/material";
import { IGameRule } from "../data/armySlice";
import { groupBy, groupMap, intersperse } from "../services/Helpers";
import UnitService, { IFullUnit } from "../services/UnitService";
import UpgradeService from "../services/UpgradeService";
import _ from "lodash";
import { ISelectedUnit, IUpgradeGainsItem, IUpgradeGainsRule } from "../data/interfaces";
import RuleList from "./components/RuleList";
import { IViewPreferences } from "../pages/view";
import EquipmentService from "../services/EquipmentService";
import { SpellsCard } from "./ViewCards";

interface ViewTableProps {
  prefs: IViewPreferences;
}

export default function ViewTable({ prefs }: ViewTableProps) {
  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army);
  const [maxCellWidth, setMaxCellWidth] = useState(0);

  const gameRules = army.rules;
  const armyRules = army.loadedArmyBooks.flatMap((x) => x.specialRules);
  const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);

  const units = UnitService.getFullUnitList(list?.units, true);
  const unitGroups = UnitService.getGroupedDisplayUnits(units);

  useEffect(() => {
    var maxCellWidth = Array.from(document.querySelectorAll(".weapon-name-cell")).reduce(
      (width, elem) => Math.max(width, elem.getBoundingClientRect().width),
      0
    );
    setMaxCellWidth(maxCellWidth);
  });

  const getUnitRow = (unit: IFullUnit, unitCount: number, heroes: ISelectedUnit[]) => {
    return (
      <>
        {heroes.map((hero) => (
          <UnitRow
            unit={hero}
            count={1}
            prefs={prefs}
            ruleDefinitions={ruleDefinitions}
            maxCellWidth={maxCellWidth}
          />
        ))}
        <UnitRow
          unit={unit.unit}
          count={unitCount}
          prefs={prefs}
          ruleDefinitions={ruleDefinitions}
          cost={unit.unitPoints}
          maxCellWidth={maxCellWidth}
        />
      </>
    );
  };

  return (
    <>
      <TableContainer sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "600" }}>Unit</TableCell>
              <TableCell style={{ fontWeight: "600" }}>Stats</TableCell>
              <TableCell style={{ fontWeight: "600" }}>Loadout</TableCell>
              <TableCell style={{ fontWeight: "600" }}>Special Rules</TableCell>
            </TableRow>
          </TableHead>
          {prefs.combineSameUnits
            ? Object.values(unitGroups).map((grp: IFullUnit[], i) => {
                const unit = grp[0];
                const count = grp.length;
                return getUnitRow(unit, count, unit.heroes);
              })
            : units.map((unit, i) => {
                return getUnitRow(unit, 1, unit.heroes);
              })}
        </Table>
      </TableContainer>
      {prefs.showPsychic && <SpellsCard army={army} list={list} />}
    </>
  );
}

interface UnitRowProps {
  unit: ISelectedUnit;
  count: number;
  prefs: IViewPreferences;
  ruleDefinitions: any;
  maxCellWidth: number;
  cost?: number;
}

function UnitRow({ unit, count, prefs, ruleDefinitions, maxCellWidth, cost }: UnitRowProps) {
  const unitRules = unit.specialRules
    .filter((r) => r.name != "-")
    .concat(UnitService.getUpgradeRules(unit));
  const items = unit.loadout.filter((x) => x.type === "ArmyBookItem") as IUpgradeGainsItem[];

  const stats = (
    <TableCell>
      Qua {unit.quality}+&nbsp;&nbsp;&nbsp;Def {unit.defense}+
    </TableCell>
  );

  const loadout = (
    <TableCell>
      {groupMap(
        unit.loadout
          .filter((x) => x.attacks)
          .concat(items.flatMap((x) => x.content.filter((x) => x.attacks))),
        (x) => x.name + x.attacks,
        (group, key) => {
          const weapon = group[0];
          return (
            <Typography key={key} variant="body2">
              {_.sumBy(group, (x) => x.count)}x {EquipmentService.formatString(weapon)}
            </Typography>
          );
        }
      )}
    </TableCell>
  );

  const rulesSection = (
    <TableCell>
      {(() => {
        const rules = groupMap(
          unitRules,
          (x) => x.name,
          (group, key) => <RuleList key={key} specialRules={group} />
        );

        const itemRules = groupMap(
          items,
          (x) => x.name,
          (group, key) => {
            const item: IUpgradeGainsItem = group[0] as IUpgradeGainsItem;
            const count = _.sumBy(group, (x) => x.count || 1);

            const itemRules: IUpgradeGainsRule[] = item.content.filter(
              (x) => x.type === "ArmyBookRule" || x.type === "ArmyBookDefense"
            ) as any;

            const itemAffectsAll =
              unit.selectedUpgrades.find((x) => x.option.gains.some((y) => y.name === item.name))
                ?.upgrade?.affects === "all";
            //const hasStackableRule = itemRules.some((x) => x.name === "Impact");
            const hideCount = itemAffectsAll; // && !hasStackableRule;

            return (
              <span key={key}>
                {count > 1 && !hideCount && `${count}x `}
                {item.name}
                {itemRules.length > 0 && (
                  <>
                    <span>(</span>
                    <RuleList specialRules={itemRules} />
                    <span>)</span>
                  </>
                )}
              </span>
            );
          }
        );

        return intersperse(rules.concat(itemRules), <span>, </span>);
      })()}
    </TableCell>
  );

  return (
    <TableRow>
      <TableCell style={{ fontWeight: "600", fontSize: "16px" }}>
        {count > 1 ? `${count}x ` : ""}
        {unit.customName || unit.name}
        <span className="" style={{ color: "#666666" }}>
          {" "}
          [{unit.size}]
        </span>
        {prefs.showPointCosts && (
          <span className="ml-1" style={{ fontSize: "14px", color: "#666666" }}>
            - {cost || UpgradeService.calculateUnitTotal(unit)}pts
          </span>
        )}
      </TableCell>
      {stats}
      {loadout}
      {rulesSection}
    </TableRow>
  );
}

function getRules(unit: ISelectedUnit) {
  const unitRules = (unit.specialRules || []).filter((r) => r.name != "-");

  const rulesFromUpgrades = UnitService.getAllUpgradedRules(unit);
  const weaponRules = UnitService.getAllEquipment(unit)
    .filter((e) => e.attacks > 0)
    .flatMap((e) => e.specialRules);

  const rules = unitRules.concat(rulesFromUpgrades).filter((r) => !!r && r.name != "-");
  const ruleGroups = groupBy(rules, "name");
  const ruleKeys = Object.keys(ruleGroups);
  return { keys: ruleKeys, groups: ruleGroups, weaponRules };
}
