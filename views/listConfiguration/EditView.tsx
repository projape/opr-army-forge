import { Button, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateListSettings } from "../../data/listSlice";

interface EditViewProps {
  armyName: string;
  pointsLimit: number;
  competitive: boolean;
}

export default function EditView(props: EditViewProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [competitive, setCompetitive] = useState(props.competitive);
  
  const update = () => {
    dispatch(
      updateListSettings({
        name: props.armyName,
        pointsLimit: props.pointsLimit || 0,
        competitive: competitive
      })
    );

    router.push({ pathname: "/list", query: { ...router.query } });
  };

  return (
    <>
      <FormGroup sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={competitive} onClick={() => setCompetitive(x => !x)} />}
          label="Competitive Validation"
        />
      </FormGroup>

      <Grid container justifyContent={"center"} sx={{ mt: 2 }}>
        <Button sx={{ px: 6 }} variant="contained" onClick={() => update()}>
          Save Changes
        </Button>
      </Grid>
    </>
  );
}
