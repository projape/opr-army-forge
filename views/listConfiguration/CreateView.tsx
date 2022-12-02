import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getArmyBookData } from "../../data/armySlice";
import { IUnit } from "../../data/interfaces";
import { addCombinedUnit, addUnit, applyUpgrade, createList } from "../../data/listSlice";
import { RootState, useAppDispatch } from "../../data/store";
import PersistenceService from "../../services/PersistenceService";
import SplitButton from "../components/SplitButton";
import { getUnitCategories } from "../UnitSelection";

interface CreateViewProps {
  armyName: string;
  pointsLimit: number;
}

export function CreateView(props: CreateViewProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const armyState = useSelector((state: RootState) => state.army);
  const [autoSave, setAutoSave] = useState(
    localStorage["AF_AutoSave"] ? JSON.parse(localStorage["AF_AutoSave"]) : true
  );
  const armyId = router.query["armyId"] as string;

  useEffect(() => {
    if (armyState.armyBooks?.length < 1) return;

    if (armyId && armyState.loadedArmyBooks.length === 0) {
      dispatch(
        getArmyBookData({
          armyUid: armyId,
          gameSystem: armyState.gameSystem,
          reset: false,
        })
      );
    }
  }, [armyState.armyBooks]);

  const toggleAutoSave = () => {
    setAutoSave((prev) => {
      localStorage["AF_AutoSave"] = !prev;
      return !prev;
    });
  };

  const dispatchCreate = (campaignMode: boolean) => {
    const name = props.armyName || "My List";

    const creationTime = autoSave ? PersistenceService.createSave(armyState, name) : null;

    dispatch(
      createList({
        id: nanoid(8),
        key: nanoid(),
        name,
        units: [],
        points: 0,
        pointsLimit: props.pointsLimit || 0,
        creationTime: creationTime,
        campaignMode: campaignMode,
        gameSystem: armyState.gameSystem,
      })
    );
    return creationTime;
  };

  const create = (campaignMode: boolean) => {
    const creationTime = dispatchCreate(campaignMode);

    router.push({ pathname: "/list", query: { listId: creationTime } });
  };

  const generateArmy = async () => {
    console.group("ARMY GENERATE");

    const creationTime = dispatchCreate(false);

    const getRandomFrom = (array: any[]) => array[Math.floor(Math.random() * array.length)];

    const armyBook = armyState.loadedArmyBooks[0];
    const units = armyBook.units;
    const unitGroups = getUnitCategories(units);
    console.log("GEN unit groups", unitGroups);

    const heroPoints = 500;
    const heroCount = Math.floor(props.pointsLimit / 500);

    let pointsRemaining = props.pointsLimit;
    let heroUpgradesCost = 0;
    const selections: IUnit[] = [];

    const getPointsRemaining = () => props.pointsLimit - _.sumBy(selections, (x) => x.cost) - heroUpgradesCost;

    // Add Heroes
    selections.push(...new Array(heroCount)
      .fill(null)
      .map((x) => getRandomFrom(unitGroups.Heroes)));

    // Add upgrades to heroes
    for (let hero of selections) {
      const heroUpgradeSection = hero
        .upgrades
        .flatMap(x => armyBook.upgradePackages.find(pkg => pkg.uid === x).sections)
        .find(x => x.isHeroUpgrade === true);

      // get a random option from the hero upgrade section
      const heroUpgrade = getRandomFrom(heroUpgradeSection.options);

      // Track the cost
      heroUpgradesCost += heroUpgrade.cost;

      // Add the hero to the list
      const { payload }: any = await dispatch(addUnit(hero));

      // Apply upgrade to the hero
      dispatch(applyUpgrade({ unitId: payload.selectionId, upgrade: heroUpgradeSection, option: heroUpgrade }));
    }

    const getChoices = (category: string, pointLimit?: number) =>
      unitGroups[category]
        .filter((x) => x.cost <= (pointLimit ?? getPointsRemaining()))
        // no unit may be worth >33% of total point cost
        .filter((x) => x.cost <= props.pointsLimit * 0.3333);

    const vehicles = (() => {
      let vehicleMax = props.pointsLimit * 0.3333;
      let vehicleRemaining = vehicleMax;
      const vehicles = [];
      let choices = [];
      // While there are still choices available
      while ((choices = getChoices("Vehicles / Monsters", vehicleRemaining)).length > 0) {
        vehicles.push(getRandomFrom(choices));
        vehicleRemaining = vehicleMax - _.sumBy(vehicles, (x) => x.cost);
      }
      return vehicles;
    })();

    selections.push(...vehicles);

    let choices = [];
    // While there are still choices available
    while ((choices = getChoices("Core Units")).length > 0) {
      selections.push(getRandomFrom(choices));
    }
    console.log("GEN All selections:", selections);
    console.log("GEN Points left...", pointsRemaining);

    var selectionGroups = _.groupBy(selections, (unit) => unit.name);

    for (let key of Object.keys(selectionGroups)) {
      const group = selectionGroups[key];

      let i = 0;
      let lastId: string = "";

      for (let unit of group) {
        const isEvenNumber = ++i % 2 === 0;
        const isHero = unit.specialRules.some((x) => x.name === "Hero");

        if (isEvenNumber && !isHero && unit.size > 1) {
          // Attach to last unit
          dispatch(addCombinedUnit(lastId));
          console.log("Combining unit", lastId);
        }
        // Heroes are already added above
        else if (!isHero) {
          const { payload }: any = await dispatch(addUnit(unit));
          console.log("GEN added unit", payload);
          lastId = payload.selectionId;
        }
      }
    }

    /*
- DONE add 1 hero per full Xpts in the list (see comp rules for X)
- DONE add up to 100% of infantry units
- DONE add up to 33% of vehicles/monsters/artillery/titans
- add up to 15% of aircraft
- DONE no unit may be worth >33% of total point cost
- DONE if 2 of same unit are generated, always combine them
- max 1+X copies of same unit, where X is 1 per full Xpts (merged units count as 1 copy)
- max 1 unit per full Xpts in the list (see comp rules for X)

in a 2000pts list, it should:
1 - add 4 random heroes
2 - fill up the rest of the list with random non-hero units
3 - check all the requirements, and remove anything that breaks them
4 - fill out the remaining points with infantry
     */
    console.groupEnd();
    router.push({ pathname: "/list", query: { listId: creationTime } });
  };

  const armyGenInvalid =
    props.pointsLimit > 0 && (props.pointsLimit > 4000 || props.pointsLimit < 150);
  const armyGenDisabled =
    armyState.loadingArmyData ||
    armyState.loadedArmyBooks.length === 0 ||
    !props.pointsLimit ||
    armyGenInvalid;

  const generateOptions = [
    { label: "Generate Starter List", action: () => generateArmy() },
    { label: "Generate Starter List (800pt)", action: () => generateArmy() },
    { label: "Generate Starter List (2000pt)", action: () => generateArmy() }
  ];

  return (
    <>
      <FormGroup sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={autoSave} onClick={toggleAutoSave} />}
          label="Auto-save changes"
        />
      </FormGroup>
      <Stack alignItems="center" spacing={2} mt={2}>
        <SplitButton
          options={[{ label: "Create List", action: () => create(false) }, { label: "Create Campaign List", action: () => create(true) }]}
          disabled={armyState.loadingArmyData || armyState.loadedArmyBooks.length === 0} />

        <SplitButton
          options={generateOptions}
          disabled={armyGenDisabled || armyGenInvalid} />
      </Stack>
      {armyGenDisabled && (
        <Typography align="center" variant="body2" sx={{ mt: 1 }}>
          Enter a point limit to enable army generation.{" "}
          {armyGenInvalid ? "Points limit must be 150-4000 points." : ""}
        </Typography>
      )}
    </>
  );
}
