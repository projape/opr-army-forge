import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  Stack,
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
    <Container>
      {armyData.units.map((unit) => (
        <Card key={unit.id} elevation={1} sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row">
              <Typography sx={{ flex: 1 }} variant="h5">
                {unit.name} [{unit.size}] | Qua {unit.quality}+ / Def {unit.defense}+
              </Typography>
              <Typography variant="h6">{unit.cost}pts</Typography>
            </Stack>
            {unit.specialRules.length > 0 && (
              <Typography sx={{ mb: 1 }}>
                {unit.specialRules
                  .map((rule) => `${rule.name}${rule.rating && `(${rule.rating})`}`)
                  .join(", ")}
              </Typography>
            )}
            <Typography mb={1}>
              {unit.equipment.map((e) => EquipmentService.formatString(e)).join(", ")}
            </Typography>
            <Grid container spacing={2}>
              {unit.upgrades
                .map((x) => armyData.upgradePackages.find((pkg) => pkg.uid === x))
                .filter((x) => x)
                .reduce((sections, next) => sections.concat(next.sections), [])
                .map((section) => (
                  <Grid item key={section.id} xs={4}>
                    <Typography fontWeight={600}>
                      {section.parentPackageUid} | {section.label}
                    </Typography>
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
          </CardContent>
          {/* <TableRow>
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
                              <p>
                                {pkg.uid} | {section.label}
                              </p>
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
          )}*/}
        </Card>
      ))}
    </Container>
  );
}
