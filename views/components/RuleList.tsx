import RuleItem from "./RuleItem";
import { RootState } from "../../data/store";
import { useSelector } from "react-redux";
import { IGameRule } from "../../data/armySlice";
import { ISpecialRule } from "../../data/interfaces";
import RulesService from "../../services/RulesService";
import { ITrait } from "../../services/TraitService";

export default function RuleList({ specialRules }: { specialRules: (ISpecialRule | ITrait)[] }) {
  const army = useSelector((state: RootState) => state.army);
  const gameRules = army.rules;
  const armyRules = army.loadedArmyBooks.flatMap((x) => x.specialRules);
  const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);

  const rules = specialRules?.filter((r) => !!r && r.name != "-") ?? [];

  if (!rules || rules.length === 0) return null;

  const ruleItems = RulesService.group(rules as ISpecialRule[]).map((rule) => {
    const ruleDefinition = ruleDefinitions.filter(
      (r) => /(.+?)(?:\(|$)/.exec(r.name)[0] === rule.name
    )[0];

    return (
      <RuleItem
        key={rule.name}
        label={RulesService.displayName(rule, rule.count)}
        description={(rule as any).description || ruleDefinition?.description || ""}
      />
    );
  });

  return <>{ruleItems}</>;
}

//export const MemoisedRuleList = memo(RuleList);
