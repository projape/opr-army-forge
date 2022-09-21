import { Button, Checkbox, Grid, FormControlLabel, FormGroup, Stack } from "@mui/material";
import _ from "lodash";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArmyBookData } from "../../data/armySlice";
import { addUnit, createList } from "../../data/listSlice";
import { RootState } from "../../data/store";
import PersistenceService from "../../services/PersistenceService";
import { getUnitCategories } from "../UnitSelection";

interface CreateViewProps {
  armyName: string;
  pointsLimit: number;
}

export function CreateView(props: CreateViewProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const armyState = useSelector((state: RootState) => state.army);

  const [autoSave, setAutoSave] = useState(
    localStorage["AF_AutoSave"] ? JSON.parse(localStorage["AF_AutoSave"]) : true
  );
  const [isCampaignList, setCampaignList] = useState(false);

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

  const dispatchCreate = () => {
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
        campaignMode: isCampaignList,
        gameSystem: armyState.gameSystem,
      })
    );
    return creationTime;
  };

  const create = () => {
    const creationTime = dispatchCreate();

    router.push({ pathname: "/list", query: { listId: creationTime } });
  };

  const generateArmy = () => {
    console.log("Generate");

    const creationTime = dispatchCreate();

    const getRandomFrom = (array: any[]) => array[Math.floor(Math.random() * array.length)];

    const armyBook = armyState.loadedArmyBooks[0];
    const units = armyBook.units;
    const unitGroups = getUnitCategories(units);
    console.log(unitGroups);

    const heroPoints = 500;
    const heroCount = Math.floor(props.pointsLimit / 500);

    const selections = new Array(heroCount).fill(null).map((x) => getRandomFrom(unitGroups.Heroes));

    let pointsRemaining = props.pointsLimit;

    const getChoices = (category: string, pointLimit?: number) =>
      unitGroups[category].filter((x) => x.cost <= (pointLimit ?? pointsRemaining));

    const vehicles = (() => {
      debugger;
      let vehicleMax = props.pointsLimit * 0.3333;
      let vehicleRemaining = vehicleMax;
      const vehicles = [];
      let choices = [];
      // While there are still choices available
      while ((choices = getChoices("Vehicles / Monsters", vehicleRemaining)).length > 0) {
        vehicles.push(getRandomFrom(choices));
        vehicleRemaining = vehicleMax - _.sumBy(vehicles, (x) => x.cost);
        pointsRemaining = props.pointsLimit - _.sumBy(selections, (x) => x.cost);
      }
      return vehicles;
    })();

    selections.push(...vehicles);

    let choices = [];
    // While there are still choices available
    while ((choices = getChoices("Core Units")).length > 0) {
      console.log(choices);
      selections.push(getRandomFrom(choices));
      pointsRemaining = props.pointsLimit - _.sumBy(selections, (x) => x.cost);
    }
    console.log(selections);
    console.log("Points left...", pointsRemaining);

    // Add selections to list
    for (let unit of selections) {
      dispatch(addUnit(unit));
    }
    /*
- DONE add 1 hero per full Xpts in the list (see comp rules for X)
- DONE add up to 100% of infantry units
- DONE add up to 33% of vehicles/monsters/artillery/titans
- add up to 15% of aircraft
- no unit may be worth >33% of total point cost
- if 2 of same unit are generated, always combine them
- max 1+X copies of same unit, where X is 1 per full Xpts (merged units count as 1 copy)
- max 1 unit per full Xpts in the list (see comp rules for X)

in a 2000pts list, it should:
1 - add 4 random heroes
2 - fill up the rest of the list with random non-hero units
3 - check all the requirements, and remove anything that breaks them
4 - fill out the remaining points with infantry
     */

    router.push({ pathname: "/list", query: { listId: creationTime } });
  };

  return (
    <>
      <FormGroup sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={autoSave} onClick={toggleAutoSave} />}
          label="Auto-save changes"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={isCampaignList} onClick={() => setCampaignList((prev) => !prev)} />
          }
          label="Campaign Mode"
        />
      </FormGroup>
      <Stack alignItems="center" spacing={2} mt={2}>
        <Button
          sx={{ px: 6 }}
          variant="contained"
          onClick={() => create()}
          disabled={armyState.loadingArmyData || armyState.loadedArmyBooks.length === 0}
        >
          Create List
        </Button>
        <Button
          sx={{ px: 6 }}
          variant="contained"
          onClick={() => generateArmy()}
          disabled={armyState.loadingArmyData || armyState.loadedArmyBooks.length === 0 || !props.pointsLimit}
        >
          Generate Army
        </Button>
      </Stack>
    </>
  );
}
