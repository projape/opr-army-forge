import {
  Grid,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { Fragment } from "react";
import EquipmentService from "../services/EquipmentService";
import WebappApiService from "../services/WebappApiService";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // ?armyId=w7qor7b2kuifcyvk&gameSystem=gf
  const { armyId, gameSystem } = context.query;
  const armyData = await WebappApiService.getArmyBookData(armyId as string, gameSystem as string);
  return {
    props: {
      armyData,
    },
  };
}

interface CodexProps {
  armyData: any;
}

export default function Codex({ armyData }: CodexProps) {
  console.log(armyData);
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name [Size]</TableCell>
          <TableCell>Qua</TableCell>
          <TableCell>Def</TableCell>
          <TableCell>Equipment</TableCell>
          <TableCell>Special Rules</TableCell>
          <TableCell>Upgrades</TableCell>
          <TableCell>Cost</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {armyData.units.map((unit) => (
          <Fragment key={unit.id}>
            <TableRow>
              <TableCell>{unit.name}</TableCell>
              <TableCell>{unit.quality}+</TableCell>
              <TableCell>{unit.defense}+</TableCell>
              <TableCell>
                {unit.equipment.map((e) => EquipmentService.formatString(e)).join(", ")}
              </TableCell>
              <TableCell>
                {unit.specialRules
                  .map((rule) => `${rule.name}${rule.rating && `(${rule.rating})`}`)
                  .join(", ")}
              </TableCell>
              <TableCell>{unit.upgrades.join(", ")}</TableCell>
              <TableCell>{unit.cost}pts</TableCell>
            </TableRow>
            {unit.upgrades.length > 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  {unit.upgrades
                    .map((x) => armyData.upgradePackages.find((pkg) => pkg.uid === x))
                    .map(
                      (pkg) =>
                        pkg && (
                          <Grid container spacing={2}>
                            {pkg.sections.map((section) => (
                              <Grid item key={section.id}>
                                <p>{pkg.uid} | {section.label}</p>
                                <List>
                                  {section.options.map((option) => (
                                    <ListItem sx={{ padding: 0.33 }}>
                                      <Typography sx={{ flex: 1 }}>{option.label}</Typography>
                                      <Typography>{option.cost}pts</Typography>
                                    </ListItem>
                                  ))}
                                </List>
                              </Grid>
                            ))}
                          </Grid>
                        )
                    )}
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
