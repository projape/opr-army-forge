import { AppBar, IconButton, Paper, Toolbar, Typography } from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import _ from "lodash";
import { useMediaQuery } from "react-responsive";

export interface MenuBarProps {
  title: string;
  transparent?: boolean;
  onBackClick: () => void;
  right?: JSX.Element;
}

export function MenuBar(props: MenuBarProps) {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  const appBar = (
    <AppBar
      position="static"
      elevation={0}
      color={props.transparent ? "transparent" : undefined}
      sx={{ px: 1 }}
    >
      <Toolbar disableGutters>
        <IconButton
          size={isBigScreen ? "large" : "medium"}
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 0, ml: 0 }}
          onClick={props.onBackClick}
        >
          <BackIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: isBigScreen ? null : "18px",
            flexGrow: 1,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {props.title}
        </Typography>
        {props.right}
      </Toolbar>
    </AppBar>
  );

  return props.transparent ? (
    appBar
  ) : (
    <Paper className="no-print" elevation={2} color="primary" square>
      {appBar}
    </Paper>
  );
}
