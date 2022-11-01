import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Checkbox,
  Stack,
  Typography,
} from "@mui/material";
import { IconButton } from "@mui/material";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ISelectedUnit } from "../../data/interfaces";
import { useDispatch } from "react-redux";
import TraitService from "../../services/TraitService";
import { ISkillSet, ITrait } from "../../services/TraitService";
import { adjustXp, toggleTrait } from "../../data/listSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RuleList from "../components/RuleList";

interface CampaignUpgradesProps {
  unit: ISelectedUnit;
}

export default function CampaignUpgrades({ unit }: CampaignUpgradesProps) {
  const dispatch = useDispatch();

  const isHero = unit.specialRules.some((r) => r.name === "Hero");
  const allTraitDefinitions = TraitService.getTraitDefinitions();

  const traitDefinitions = isHero ? allTraitDefinitions.heroes : allTraitDefinitions.units;

  const level = unit.xp ? Math.floor(unit.xp / 5) : 0;

  const isInjury = (trait: string) => !!allTraitDefinitions.injuries.find((x) => x.name === trait);
  const isTalent = (trait: string) => !!allTraitDefinitions.talents.find((x) => x.name === trait);

  let traitCount = 0,
    injuryCount = 0,
    talentCount = 0;
  for (let trait of unit.traits) {
    if (isInjury(trait)) injuryCount++;
    else if (isTalent(trait)) talentCount++;
    else traitCount++;
  }

  const adjustUnitXp = (xp: number) => {
    dispatch(adjustXp({ unitId: unit.selectionId, xp }));
  };

  const toggleUnitTrait = (trait: ITrait) => {
    dispatch(toggleTrait({ unitId: unit.selectionId, trait: trait.name }));
  };

  const traitControls = (traits, requireLevels: boolean = false) => {
    return traits.map((trait) => {
      const checked = !!unit.traits?.find((t) => t === trait.name);
      return (
        <Stack key={trait.name} direction="row" alignItems="center">
          <div style={{ flex: 1 }}>
            <RuleList specialRules={[trait]} />
          </div>
          <Checkbox
            checked={checked}
            onClick={() => toggleUnitTrait(trait)}
            value={trait.name}
            disabled={requireLevels ? unit.xp < 5 : false}
          />
        </Stack>
      );
    });
  };

  const displayCount = (count) =>
    count > 0 && (
      <Typography component="span" ml={0.5} color="text.secondary">
        {" "}
        [{count}]
      </Typography>
    );

  return (
    <>
      <Box px={2} mt={2}>
        <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.7 }}>Campaign Traits</p>
      </Box>
      <Card elevation={0} square sx={{ px: 2, pt: 1, pb: 2 }}>
        <Stack direction="row" alignItems="center">
          <Box pr={1} flex={1}>
            Unit XP{" "}
            <Typography component="span" color="text.secondary">
              (Level {level})
            </Typography>
          </Box>
          <IconButton
            disabled={unit.xp === 0}
            color={unit.xp > 0 ? "primary" : "default"}
            onClick={() => adjustUnitXp(-1)}
          >
            <DownIcon />
          </IconButton>
          <span>{unit.xp}XP</span>
          <IconButton disabled={unit.xp >= 30} color="primary" onClick={() => adjustUnitXp(1)}>
            <UpIcon />
          </IconButton>
        </Stack>

        <Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {isHero ? "Skill Sets " : "Traits "}
              {displayCount(traitCount)}
            </AccordionSummary>
            <AccordionDetails>
              {isHero
                ? (traitDefinitions as ISkillSet[]).map((skillSet) => (
                    <Accordion key={skillSet.name}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {skillSet.name}
                      </AccordionSummary>
                      <AccordionDetails>{traitControls(skillSet.traits, true)}</AccordionDetails>
                    </Accordion>
                  ))
                : traitControls(traitDefinitions, true)}
            </AccordionDetails>
          </Accordion>
        </Box>
        {isHero && (
          <Box mt={2}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Injuries {displayCount(injuryCount)}
              </AccordionSummary>
              <AccordionDetails>{traitControls(allTraitDefinitions.injuries)}</AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Talents {displayCount(talentCount)}
              </AccordionSummary>
              <AccordionDetails>{traitControls(allTraitDefinitions.talents)}</AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Card>
    </>
  );
}
