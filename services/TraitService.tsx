import UpgradeService from "../services/UpgradeService";
import { traitDefinitions } from "../data/campaign";

export interface ITrait {
  name: string;
  description: string;
}

export interface ISkillSet {
  id: string;
  name: string;
  traits: ITrait[];
}

interface ICampaignData {
  units: ITrait[];
  heroes: ISkillSet[];
  injuries: ITrait[];
  talents: ITrait[];
}

export default class TraitService {
  
  static getTraitDefinitions(): ICampaignData {
    return traitDefinitions[UpgradeService.gameSystem];
  }

  static getFlatTraitDefinitions(): ITrait[] {
    const defs = traitDefinitions[UpgradeService.gameSystem];
    if (!traitDefinitions[UpgradeService.gameSystem]["all"]) {
      traitDefinitions[UpgradeService.gameSystem]["all"] = defs.units.concat(defs.injuries).concat(defs.talents).concat(defs.heroes.flatMap(x => x.traits));
    }
    return traitDefinitions[UpgradeService.gameSystem]["all"];
  }

  /**
   * Groups traits into injuries, talents and traits by checking their name against the campaign data.
   * The output are ITrait-s to be able to use them in RuleLists.
   * @param {string[]} traits an array of trait names
   * @return {} a dictionary with keys "injuries", "talents" and "traits" containing ITrait[] with trait names and descriptions correctly set
   */
  static groupTraits(traits: string[]): { [key: string]: ITrait[] } {
    const groupedTraits: { [key: string]: ITrait[] } = {};

    if (!traits || traits.length === 0) return groupedTraits;

    groupedTraits["injuries"] = [];
    groupedTraits["talents"] = [];
    groupedTraits["traits"] = [];

    const allTraitDefinitions = TraitService.getTraitDefinitions();
    const flatTraitDefinitions = TraitService.getFlatTraitDefinitions();
    
    const isInjury = (trait: string) => !!allTraitDefinitions.injuries.find((x) => x.name === trait);
    const isTalent = (trait: string) => !!allTraitDefinitions.talents.find((x) => x.name === trait);

    for (let trait of traits) {

      const traitDescription = flatTraitDefinitions.find((x) => x.name === trait).description;

      // everything that's not an injury or talent is treated as a trait. While heroes in campaigns also
      // gain skill sets, those are just containers for traits and thus we can ignore them here
      groupedTraits[
        isInjury(trait) ? "injuries" :
        isTalent(trait) ? "talents" :
        "traits"
        ].push( { name: trait, description: traitDescription } );
    }

    return groupedTraits;
  }
}