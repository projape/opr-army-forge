import { List, ListItem, ListItemText, Dialog, DialogTitle, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../data/store";
import _ from "lodash";
import ValidationService from "../services/ValidationService";

export default function ValidationErrors({ open, setOpen }) {
  const army = useSelector((state: RootState) => state.army);
  const list = useSelector((state: RootState) => state.list);

  const competitiveRulesLink = competitiveGoogleDriveLinks[army.gameSystem];
  const errors = ValidationService.getErrors(army, list);

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle sx={{ pb: 0 }}>Competitive List Validation</DialogTitle>
      <List>
        <ListItem sx={{ pt: 0 }}>
          <Typography color="text.secondary">
            Note: <span style={{ fontWeight: 600 }}>If you are playing with the optional competitive rules</span>,
            your current list is not valid because it breaks the army composition restrictions shown below. Download the <a
              href={competitiveRulesLink}
              target="_blank"
              style={{ textDecoration: "underline" }}
            >competitive rules here.</a>

          </Typography>
        </ListItem>
        {errors.map((error, index) => (
          <ListItem key={index} divider>
            <ListItemText>{error}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export const competitiveGoogleDriveLinks = {
  gf: "https://drive.google.com/drive/folders/1EkkrFT5yqDLzeSAM_VfPbSYTE8ITbb7i",
  gff: "https://drive.google.com/drive/folders/1m_6Iw5pf20eaL9sROO7efbIdvFBxjZSD",
  aof: "https://drive.google.com/drive/folders/19ebqbc_jqtfmgn73zx-9M3yIkuSLhQWw",
  aofs: "https://drive.google.com/drive/folders/1UhNNOiXpKLh9ClYZ0MMLSWZVKNGrhZtY",
  aofr: "https://drive.google.com/drive/folders/19ebqbc_jqtfmgn73zx-9M3yIkuSLhQWw",
};
