import RuleItem from "./RuleItem";
import { RootState } from "../../data/store";
import { useSelector } from "react-redux";
import { IGameRule } from "../../data/armySlice";
import { ISpecialRule } from "../../data/interfaces";
import RulesService from "../../services/RulesService";
import { ITrait } from "../../services/TraitService";
import { intersperse } from "../../services/Helpers";

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

    const label = RulesService.displayName(rule, rule.count);
    const description =
      (rule.rating ? `${rule.name}(X)` : rule.name) + ": " + ((rule as any).description || ruleDefinition?.description || "");

    return (
      <RuleItem
        key={rule.name}
        label={label}
        description={description}
      />
    );
  });

  return <>{intersperse(ruleItems, <span>,&nbsp;&nbsp;</span>)}</>;
}

//export const MemoisedRuleList = memo(RuleList);
