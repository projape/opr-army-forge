import { IGroupedSpecialRule, ISpecialRule } from "../data/interfaces";
import { groupMap } from "./Helpers";

export default class RulesService {

  public static group(rules: ISpecialRule[]): IGroupedSpecialRule[] {
    return groupMap(rules, rule => rule.name, (group, key) => {
      const rule = group[0];
      const stack = rule.rating && ["Tough", "Impact"].indexOf(rule.name) > -1;
      const rating = !rule.rating
        ? null
        : stack
          ? group.reduce((total, next) => next.rating ? total + parseInt(next.rating) : total, 0)
          : Math.max(...group.map(rule => parseInt(rule.rating)));
      return {
        ...rule,
        count: stack ? 0 : group.length,
        rating: rating?.toString()
      };
    });
  }

  public static displayName(rule: ISpecialRule, count: number = null) {

    const countStr = (count > 1 ? `${count}x ` : "");
    const ratingStr = rule.rating
      ? rule.name === "Defense"
        ? ` +${rule.rating}`
        : `(${(rule.modify ? "+" : "") + rule.rating})`
      : "";
    return countStr
      + rule.name
      + (ratingStr)
      + (rule.condition ? ` ${rule.condition}` : "");
  }
}