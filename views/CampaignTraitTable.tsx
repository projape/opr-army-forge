import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TraitService from "../services/TraitService";
import { ITrait }  from "../data/campaign";
import RuleList from "./components/RuleList";

interface CampaignTraitTableProps {
  traits: string[];
  square: boolean;
  hideTraits?: boolean;
}

export default function CampaignTraitTable({
  traits,
  square,
  hideTraits = false,
}: CampaignTraitTableProps) {
  const hasTraits = traits?.length > 0;

  const cellStyle = {
    px: 1,
  };
  const headerStyle = { ...cellStyle, fontWeight: 600, py: 0.25 };

  const groupedTraits = TraitService.groupTraits(traits);
  Object.keys(groupedTraits).forEach(key => {
    if (groupedTraits[key].length === 0) {
      delete groupedTraits[key];
    }
  });

  return (
    <>
      {hasTraits && !hideTraits && (
        <TableContainer component={Paper} sx={{ mt: 2 }} square={square} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover", fontWeight: 600 }}>
                <TableCell sx={headerStyle}>Campaign Traits</TableCell>
                <TableCell sx={headerStyle}>Property</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Object.keys(groupedTraits).map((key: string, index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell sx={cellStyle}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </TableCell>
                      <TableCell sx={cellStyle}>
                        <RuleList specialRules={groupedTraits[key]} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}