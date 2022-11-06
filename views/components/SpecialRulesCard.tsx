import React from "react";
import style from "../../styles/Cards.module.css";
import { Box, Typography } from "@mui/material";
import _ from "lodash";
import { ISpell } from "../../data/armySlice";
import ViewCard from "./ViewCard";

interface SpecialRulesCardProps {
  usedRules: string[];
  spells: ISpell[];
  ruleDefinitions: { name: string; description: string }[];
}

function SpecialRulesCard({ usedRules, spells, ruleDefinitions }: SpecialRulesCardProps) {
  usedRules = _.uniq(usedRules).sort();
  const usedRuleDefs = [];

  console.log("SPELLS", spells);

  // Check each rule for nested rules...
  for (let rule of usedRules) {
    const usedRuleDef = ruleDefinitions.find((t) => t.name === rule);
    if (!usedRuleDef) continue;
    for (let match of ruleDefinitions) {
      // Don't match against self
      if (match.name === usedRuleDef.name) continue;

      if (new RegExp(match.name).test(usedRuleDef.description)) {
        usedRuleDefs.push(match);
      }
    }
    usedRuleDefs.push(usedRuleDef);
  }

  // Spells
  for (let spell of spells) {
    // Check every rule against the spell body...
    for (let match of ruleDefinitions) {
      // Skip this if we're already using it
      if (usedRuleDefs.find((x) => x.name === match.name)) {
        continue;
      }

      if (new RegExp(match.name).test(spell.effect)) {
        usedRuleDefs.push(match);
      }
    }
  }

  return (
    <ViewCard title="Special Rules">
      <Box className={style.grid} sx={{ p: 2, mt: 1 }}>
        {_.uniqBy(usedRuleDefs, (x) => x.name).map((r, i) => (
          <Typography key={i} sx={{ breakInside: "avoid" }}>
            <span style={{ fontWeight: 600 }}>{r.name + ": "}</span>
            <span>{r.description}</span>
          </Typography>
        ))}
      </Box>
    </ViewCard>
  );
}

export default React.memo(SpecialRulesCard);
