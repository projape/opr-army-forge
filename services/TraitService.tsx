import { getTraitDefinitions, getFlatTraitDefinitions, ITrait } from "../data/campaign";

export default class TraitService {

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

    const allTraitDefinitions = getTraitDefinitions();
    const injuryDefinitions = allTraitDefinitions["injuries"];
    const talentDefinitions = allTraitDefinitions["talents"];
    
    const flatTraitDefinitions = getFlatTraitDefinitions();
    
    const isInjury = (trait: string) => !!injuryDefinitions.find((x) => x.name === trait);
    const isTalent = (trait: string) => !!talentDefinitions.find((x) => x.name === trait);

    // using flat trait definitions works for heroes and standard units without special handling code
    const isTrait = (trait: string) => !!flatTraitDefinitions.find((x) => x.name === trait && !isInjury(x.name) && !isTalent(x.name));

    // the dictionaries created to be returned as ITraits below are currently only used as parameter for RuleList, which ignores the id of
    // the ITrait, thus we don't set any id this might lead to problems in other use cases
    for (let trait of traits) {

      const traitDescription = flatTraitDefinitions.find((x) => x.name === trait).description;

      if (isInjury(trait)) {
          groupedTraits["injuries"].push( { name: trait, description: traitDescription } );
      }
      
      if (isTalent(trait)) {
          groupedTraits["talents"].push( { name: trait, description: traitDescription } );
      }

      if (isTrait(trait)) {
          groupedTraits["traits"].push( { name: trait, description: traitDescription } );
      }
    }

    return groupedTraits;
  }
}