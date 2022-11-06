import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../data/store";
import { useRouter } from "next/router";
import ViewCards from "../views/ViewCards";
import {
  Button,
  IconButton,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Switch,
  Stack,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ClearIcon from "@mui/icons-material/Clear";
import PersistenceService from "../services/PersistenceService";
import PrintIcon from "@mui/icons-material/Print";
import ViewTable from "../views/ViewTable";
import { ISelectedUnit } from "../data/interfaces";
import UnitService from "../services/UnitService";
import { MainMenuOptions } from "../views/components/MainMenu";
import { useLoadFromQuery } from "../hooks/useLoadFromQuery";
import { MenuBar } from "../views/components/MenuBar";
import { IGameRule, ISpell } from "../data/armySlice";
import _ from "lodash";
import TraitService from "../services/TraitService";
import { Container } from "@mui/system";
import { useMediaQuery } from "react-responsive";
import SpecialRulesCard from "../views/components/SpecialRulesCard";

export interface IViewPreferences {
  showFullRules: boolean;
  showPointCosts: boolean;
  combineSameUnits: boolean;
  showPsychic: boolean;
}

export default function View() {
  const list = useSelector((state: RootState) => state.list);
  const armyState = useSelector((state: RootState) => state.army);
  const router = useRouter();
  const isBigScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  useLoadFromQuery();

  const defaultPrefs = {
    showFullRules: false,
    showPointCosts: true,
    combineSameUnits: true,
    showPsychic: listContainsPyschic(list.units),
  } as IViewPreferences;

  const [preferences, setPreferenceState] = useState(defaultPrefs);
  const [isCardView, setCardView] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const prefs = PersistenceService.getViewPreferences() || {};
    setPreferenceState((prev) => ({
      ...prev,
      ...prefs,
      showPsychic: listContainsPyschic(list.units) || ((prefs as any)?.showPsychic ?? false),
    }));
  }, []);

  // Load army list file
  const usedRules = useMemo(() => {
    const unitRules = _.flatten(
      list.units.map((u) => UnitService.getAllRules(u).map((r) => r.name))
    );

    const usedWeaponRules = _.chain(list?.units)
      .map((unit) => unit.loadout.map((x) => x.specialRules || []))
      .flattenDeep()
      .map((x) => x.name)
      .uniq()
      .value();

    const usedTraitsRules = _.chain(list?.units)
      .map((unit) => unit.traits)
      .flattenDeep()
      .uniq()
      .value();

    return unitRules.concat(usedWeaponRules).concat(usedTraitsRules);
  }, [list.units]);

  if (!armyState.loaded) return <p>Loading...</p>;

  const gameRules = armyState.rules;
  const armyRules: IGameRule[] = armyState.loadedArmyBooks.flatMap((x) => x.specialRules);
  const armySpells: ISpell[] = armyState.loadedArmyBooks.flatMap((x) => x.spells);
  const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);
  const traitDefinitions = TraitService.getFlatTraitDefinitions();

  // TODO: Filter this to just army books that have taken a psychic/wizard?
  const containsPsychic = listContainsPyschic(list.units);

  function setPreferences(setFunc) {
    const newPrefs = setFunc(preferences);
    setPreferenceState(setFunc);
    PersistenceService.saveViewPreferences(newPrefs);
  }

  const title = `${list.name} • ${list.points}pts`;

  return (
    <>
      <MenuBar
        title={title}
        onBackClick={() => router.back()}
        right={
          <>
            <IconButton
              size={isBigScreen ? "large" : "medium"}
              color="inherit"
              aria-label="menu"
              onClick={() => window.print()}
            >
              <PrintIcon />
            </IconButton>
            <IconButton
              size={isBigScreen ? "large" : "medium"}
              color="inherit"
              aria-label="menu"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon />
            </IconButton>
            <MainMenuOptions />
          </>
        }
      />
      <Drawer anchor="right" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <Stack direction="row" p={2}>
          <h3 className="is-size-4" style={{ flex: 1, margin: 0 }}>
            Display Settings
          </h3>
          <IconButton onClick={() => setSettingsOpen(false)}>
            <ClearIcon />
          </IconButton>
        </Stack>
        <List>
          <ListItem>
            <ListItemText>Show Psychic/Spells</ListItemText>
            <Switch
              edge="end"
              checked={preferences.showPsychic}
              onChange={() =>
                setPreferences((prefs) => ({ ...prefs, showPsychic: !prefs.showPsychic }))
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText>Show full special rules text</ListItemText>
            <Switch
              edge="end"
              checked={preferences.showFullRules}
              onChange={() =>
                setPreferences((prefs) => ({ ...prefs, showFullRules: !prefs.showFullRules }))
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText>Show point costs</ListItemText>
            <Switch
              edge="end"
              checked={preferences.showPointCosts}
              onChange={() =>
                setPreferences((prefs) => ({ ...prefs, showPointCosts: !prefs.showPointCosts }))
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText>Combine Similar Units</ListItemText>
            <Switch
              edge="end"
              checked={preferences.combineSameUnits}
              onChange={() =>
                setPreferences((prefs) => ({ ...prefs, combineSameUnits: !prefs.combineSameUnits }))
              }
            />
          </ListItem>
        </List>
      </Drawer>
      <Stack px={2} py={1} className="no-print" direction="row" justifyContent="flex-end">
        <Button onClick={() => setCardView(!isCardView)}>
          <Typography sx={{ mr: 1 }}>{isCardView ? "cards" : "table"}</Typography>
          {isCardView ? <DashboardIcon /> : <ViewAgendaIcon />}
        </Button>
      </Stack>
      <h1 className="print-only" style={{ fontWeight: 600 }}>
        {title}
      </h1>
      <Container maxWidth={false}>
        {isCardView ? <ViewCards prefs={preferences} /> : <ViewTable prefs={preferences} />}
        {!preferences.showFullRules && (
          <Box mb={6}>
            <SpecialRulesCard
              usedRules={usedRules}
              spells={containsPsychic ? armySpells : []}
              ruleDefinitions={ruleDefinitions.concat(traitDefinitions as any[])}
            />
          </Box>
        )}
      </Container>
    </>
  );
}



// TODO: extract these as global helper functions
export function listContainsPyschic(units: ISelectedUnit[]) {
  // TODO: get the special rule def from a well known location
  return listContainsSpecialRule(units, "Psychic") || listContainsSpecialRule(units, "Wizard");
}

export function listContainsSpecialRule(units: ISelectedUnit[], specialRule: string) {
  return units.some((unit) => {
    const upgradeRules = UnitService.getAllUpgradedRules(unit);
    return unit.specialRules.concat(upgradeRules).some(({ name }) => name === specialRule);
  });
}
