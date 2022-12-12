import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../data/store";
import style from "../styles/Cards.module.css";
import UnitEquipmentTable from "../views/UnitEquipmentTable";
import { Stack, Typography, Box, useMediaQuery } from "@mui/material";
import RulesService from "../services/RulesService";
import { ArmyState, IGameRule } from "../data/armySlice";
import { groupMap, intersperse } from "../services/Helpers";
import UnitService, { IFullUnit, IRulesItem } from "../services/UnitService";
import UpgradeService from "../services/UpgradeService";
import _ from "lodash";
import { ISelectedUnit, IUpgradeGainsItem, IUpgradeGainsRule } from "../data/interfaces";
import RuleList from "./components/RuleList";
import { IViewPreferences, listContainsPyschic } from "../pages/view";
import TraitService from "../services/TraitService";
import { ITrait } from "../services/TraitService";
import LinkIcon from "@mui/icons-material/Link";
import { ListState } from "../data/listSlice";
import ViewCard from "./components/ViewCard";

interface ViewCardsProps {
  prefs: IViewPreferences;
}

export default function ViewCards({ prefs }: ViewCardsProps) {
  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army);

  console.log("prefs", prefs);

  const gameRules = army.rules;
  const armyRules = army.loadedArmyBooks.flatMap((x) => x.specialRules);
  const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);
  const traitDefinitions = TraitService.getFlatTraitDefinitions();

  const units = UnitService.getFullUnitList(list?.units, true);
  const unitGroups = UnitService.getGroupedDisplayUnits(units);

  const getUnitCard = (unit: IFullUnit, unitCount: number, heroes: ISelectedUnit[]) => {
    return (
      <>
        {heroes.map((hero) => (
          <UnitCard
            unit={hero}
            attachedTo={unit.unit}
            pointCost={UpgradeService.calculateUnitTotal(hero)}
            count={1}
            prefs={prefs}
            ruleDefinitions={ruleDefinitions}
            traitDefinitions={traitDefinitions}
          />
        ))}
        <UnitCard
          unit={unit.unit}
          attachedTo={null}
          pointCost={unit.unitPoints}
          count={unitCount}
          prefs={prefs}
          ruleDefinitions={ruleDefinitions}
          traitDefinitions={traitDefinitions}
        />
      </>
    );
  };

  return (
    <div className={style.grid}>
      {prefs.combineSameUnits
        ? Object.values(unitGroups).map((grp: IFullUnit[], i) => {
          const unit = grp[0];
          const count = grp.length;
          return getUnitCard(
            unit,
            count,
            grp.flatMap((x) => x.heroes)
          );
        })
        : units.map((unit, i) => getUnitCard(unit, 1, unit.heroes))}
      <SpellsCard army={army} list={list} force={prefs.showPsychic} />
    </div>
  );
}

interface UnitCardProps {
  unit: ISelectedUnit;
  attachedTo: ISelectedUnit;
  pointCost: number;
  count: number;
  prefs: IViewPreferences;
  ruleDefinitions: any;
  traitDefinitions: ITrait[];
}

export function UnitCard({
  unit,
  attachedTo,
  pointCost,
  count,
  prefs,
  ruleDefinitions,
  traitDefinitions,
}: UnitCardProps) {
  const toughness = UnitService.getTough(unit);
  const tinyScreen = useMediaQuery("(max-width: 420px)", { noSsr: true });

  const unitRules = unit.specialRules
    .filter((r) => r.name != "-")
    .concat(UnitService.getUpgradeRules(unit));

  const items = unit.loadout.filter((x) => x.type === "ArmyBookItem") as IUpgradeGainsItem[];
  const itemRules: IRulesItem[] = UnitService.getItemRules(unit, items);
  const isRenamed = unit.customName && (unit.customName !== unit.name);

  const Stat = ({ label, value }: { label: string; value: string }) => (
    <Box className={style.profileStat}>
      <Typography component="span">{label}</Typography>
      <div className={style.statBreak}></div>
      <Typography component="span">{value}</Typography>
    </Box>
  );

  const stats = (
    <Stack justifyContent="center" direction="row" my={1}>
      <Stat label={tinyScreen ? "Qua" : "Quality"} value={unit.quality + "+"} />
      <Stat label={tinyScreen ? "Def" : "Defense"} value={unit.defense + "+"} />
      {toughness > 1 && (
        <Stat label={tinyScreen ? "Tough" : "Tough"} value={toughness.toString()} />
      )}
    </Stack>
  );

  const rulesSection = (
    <Box mb={1} px={1} fontSize="14px">
      {prefs.showFullRules
        ? (() => {
          const itemRules = _.flatMap(
            items,
            (item) =>
              item.content.filter(
                (x) => x.type === "ArmyBookRule" || x.type === "ArmyBookDefense"
              ) as IUpgradeGainsRule[]
          );
          return RulesService.group(unitRules.concat(itemRules)).map((rule) => {
            const ruleDefinition = ruleDefinitions.filter(
              (r) => /(.+?)(?:\(|$)/.exec(r.name)[0] === rule.name
            )[0];

            return (
              <Typography key={rule.name} fontSize={"14px"}>
                <span style={{ fontWeight: 600 }}>
                  {RulesService.displayName(rule, rule.count)} -
                </span>
                <span> {ruleDefinition?.description || ""}</span>
              </Typography>
            );
          });
        })()
        : (() => {
          const rules = groupMap(
            unitRules,
            (x) => x.name,
            (group, key) => <RuleList key={key} specialRules={group} />
          );

          const itemRulesElements = itemRules.map((item) => (
            <span key={item.name}>
              {item.count && `${item.count}x `}
              {item.name}
              {item.specialRules.length > 0 && (
                <span>
                  (<RuleList specialRules={item.specialRules} />)
                </span>
              )}
            </span>
          ));

          return intersperse(rules.concat(itemRulesElements), <span>, </span>);
        })()}
    </Box>
  );

  const traitsSection = unit.traits?.length > 0 && (
    <Box mb={1} px={1} fontSize="14px">
      <div className="px-2 mb-4" style={{ fontSize: "14px" }}>
        {unit.traits.map((trait: string, index: number) => {
          const traitDef = traitDefinitions.find((x) => x.name === trait);
          if (!prefs.showFullRules)
            return (
              <span key={index}>
                {index === 0 ? "" : ", "}
                <RuleList specialRules={[traitDef]} />
              </span>
            );

          return (
            <p key={index}>
              <span style={{ fontWeight: 600 }}>{traitDef.name} -</span>
              <span> {traitDef.description}</span>
            </p>
          );
        })}
      </div>
    </Box>
  );

  const joinedUnitText = attachedTo && (
    <Stack direction="row" justifyContent="center" mb={1}>
      <LinkIcon />
      <Typography textAlign="center">
        Joined to {attachedTo.customName || attachedTo.name}
      </Typography>
    </Stack>
  );

  return (
    <ViewCard
      title={
        <>
          {count > 1 ? `${count}x ` : ""}
          {unit.customName || unit.name}
          <Typography component="span" sx={{ color: "text.secondary" }}>
            {" "}
            [{UnitService.getSize(unit)}]{unit.xp > 0 && ` - ${unit.xp}XP`}
          </Typography>
          {prefs.showPointCosts && (
            <Typography component="span" sx={{ color: "text.secondary" }}>
              {" "}
              - {pointCost}pts
            </Typography>
          )}

        </>
      }
    >
      {false && isRenamed && <Typography variant="body2"> ({unit.name})</Typography>}
      {joinedUnitText}
      {stats}
      {rulesSection}
      {traitsSection}
      <UnitEquipmentTable loadout={unit.loadout} hideEquipment square />
      {unit.notes && (
        <Box px={2}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{unit.notes}</pre>
        </Box>
      )}
    </ViewCard>
  );
}

interface SpellsCardProps {
  army: ArmyState;
  list: ListState;
  force: boolean;
}

export function SpellsCard({ army, list, force }: SpellsCardProps) {
  const isGrimdark = army.gameSystem.startsWith("gf");
  return (
    <>
      {army.loadedArmyBooks.map((book) => {
        const enable = listContainsPyschic(list.units.filter((x) => x.armyId === book.uid));
        return (
          enable && (
            <ViewCard key={book.uid} title={`${book.name} ${isGrimdark ? "Psychic " : ""} Spells`}>
              <Box px={2}>
                {book.spells.map((spell) => (
                  <p key={spell.id}>
                    <span style={{ fontWeight: 600 }}>
                      {spell.name} ({spell.threshold}+):{" "}
                    </span>
                    <span>{spell.effect}</span>
                  </p>
                ))}
              </Box>
            </ViewCard>
          )
        );
      })}
    </>
  );
}
