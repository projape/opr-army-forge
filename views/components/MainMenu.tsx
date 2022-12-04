import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  Snackbar,
  Divider,
  ListItemIcon,
  Checkbox,
  Stack,
  useTheme,
  LinearProgress,
  Alert,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../data/store";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import PersistenceService from "../../services/PersistenceService";
import { updateCreationTime } from "../../data/listSlice";
import ValidationErrors, { competitiveGoogleDriveLinks } from "../ValidationErrors";
import ValidationService from "../../services/ValidationService";
import { useMediaQuery } from "react-responsive";
import { setDarkMode, setOpenReleaseNotes } from "../../data/appSlice";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DownloadFileIcon from "../icons/DownloadFile";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import WebappApiService from "../../services/WebappApiService";
export default function MainMenu() {
  const army = useSelector((state: RootState) => state.army);
  const list = useSelector((state: RootState) => state.list);
  const router = useRouter();

  const [validationAnchorElement, setValidationAnchorElement] = useState(null);
  const errors = ValidationService.getErrors(army, list);

  const goBack = () => {
    const confirmMsg = "Going back will discard your current list and go back home. Continue?";
    if (list.creationTime || confirm(confirmMsg)) {
      //router.back();
      router.replace("/");
    }
  };

  const competitiveRulesLink = competitiveGoogleDriveLinks[army.gameSystem];

  const isBigScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <>
      <AppBar elevation={0} sx={{ position: "sticky", top: 0, zIndex: 1, px: 1 }}>
        <Toolbar disableGutters>
          <IconButton
            size={isBigScreen ? "large" : "medium"}
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={goBack}
            sx={{ mr: 1, ml: 0 }}
          >
            <HomeIcon />
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
            {list.name}
          </Typography>
          {errors.length > 0 && (
            <>
              <IconButton
                size={isBigScreen ? "large" : "medium"}
                color="inherit"
                title="Validation warnings"
                style={{
                  backgroundColor: Boolean(validationAnchorElement) ? "#6EAAE7" : null,
                }}
                onClick={(e) => setValidationAnchorElement(e.currentTarget)}
              >
                <NotificationImportantIcon />
              </IconButton>
              <Popper
                placement="bottom-end"
                anchorEl={validationAnchorElement}
                open={Boolean(validationAnchorElement) && isBigScreen}
              // onClose={_ => setValidationAnchorElement(null)}
              >
                <ClickAwayListener onClickAway={(_) => setValidationAnchorElement(null)}>
                  <Paper>
                    <List>
                      <ListItem divider>
                        <ListItemText>
                          <Typography>Competitive List Validation</Typography>
                          <Typography color="text.secondary" sx={{mt:1, maxWidth: "480px" }}>
                            Note: <span style={{ fontWeight: 600 }}>If you are playing with the optional competitive rules</span>,
                            your current list is not valid because it breaks the army composition restrictions shown below. Download the <a
                              href={competitiveRulesLink}
                              target="_blank"
                              style={{ textDecoration: "underline" }}
                            >competitive rules here.</a>

                          </Typography>
                        </ListItemText>
                      </ListItem>
                      {errors.map((error, index) => (
                        <ListItem
                          key={index}
                          className="mx-4 px-0"
                          style={{ width: "auto" }}
                          divider={index < errors.length - 1}
                        >
                          <ListItemText>{error}</ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </>
          )}
          {isBigScreen && (
            <IconButton
              size={isBigScreen ? "large" : "medium"}
              color="inherit"
              aria-label="menu"
              title="View list"
              onClick={() => router.push({ pathname: "/view", query: router.query })}
            >
              <VisibilityIcon />
            </IconButton>
          )}
          <MainMenuOptions />
        </Toolbar>
      </AppBar>
      <ValidationErrors
        open={Boolean(validationAnchorElement) && !isBigScreen}
        setOpen={setValidationAnchorElement}
      />
    </>
  );
}

export function MainMenuOptions() {
  const army = useSelector((state: RootState) => state.army);
  const list = useSelector((state: RootState) => state.list);
  const isBigScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const [menuAnchorElement, setMenuAnchorElement] = useState(null);
  const [showTextCopiedAlert, setShowTextCopiedAlert] = useState(false);
  const [cloudShareStatus, setCloudShareStatus] = useState(CloudShareStatus.none);
  const isLive = window.location.origin.indexOf("onepagerules.com") > -1;

  const handleShareTTS = () => {
    if (!list.creationTime) {
      const creationTime = handleSave();
      PersistenceService.downloadTTS({
        ...list,
        creationTime,
      });
    } else {
      PersistenceService.downloadTTS(list);
    }
  };

  const handleSave = () => {
    const creationTime = PersistenceService.createSave(army, list.name, list);
    dispatch(updateCreationTime(creationTime));
    return creationTime;
  };

  const handleLoad = () => {
    router.push("/load");
  };

  const handleDelete = () => {
    const confirmMsg = "Are you sure you want to delete this list?";
    if (confirm(confirmMsg)) {
      PersistenceService.delete(list);
      router.replace("/");
    }
  };

  const handleShare = () => {
    if (!list.creationTime) {
      const creationTime = handleSave();
      PersistenceService.download({
        ...list,
        creationTime,
      });
    } else {
      PersistenceService.download(list);
    }
  };

  const handleTextExport = () => {
    PersistenceService.copyAsText(list);
    setShowTextCopiedAlert(true);
  };

  const navigateToListConfig = () => {
    router.push({ pathname: "/listConfiguration", query: { ...router.query, edit: true } });
  };

  const openOprWebapp = () => {
    window.open("https://webapp.onepagerules.com", "_blank");
  };

  const handleCloudShare = () => {
    setCloudShareStatus(CloudShareStatus.uploading);
    // POST list to webapp...
    WebappApiService.shareList(list)
      .then((res) => {
        const isSuccessful = res.status === 200;
        if (isSuccessful) {
          navigator.clipboard
            .writeText(window.location.origin + "/share?id=" + res.data.id)
            .then(() => setCloudShareStatus(CloudShareStatus.success));
        } else {
          setCloudShareStatus(CloudShareStatus.failed);
        }
      })
      .catch((_) => {
        setCloudShareStatus(CloudShareStatus.failed);
      });
    // check response, show dialog?
  };

  const sxIcon = { color: theme.palette.text.disabled };
  return (
    <>
      <IconButton
        size={isBigScreen ? "large" : "medium"}
        color="inherit"
        aria-label="menu"
        onClick={(e) => setMenuAnchorElement(e.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={menuAnchorElement}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(menuAnchorElement)}
        onClose={(_) => setMenuAnchorElement(null)}
      >
        <MenuItem onClick={() => router.push({ pathname: "/view", query: router.query })}>
          <ListItemIcon>
            <VisibilityIcon sx={sxIcon} />
          </ListItemIcon>
          <ListItemText>View List</ListItemText>
        </MenuItem>
        <MenuItem onClick={navigateToListConfig}>
          <ListItemIcon>
            <EditOutlinedIcon sx={sxIcon} />
          </ListItemIcon>
          <ListItemText>Edit Details</ListItemText>
        </MenuItem>
        {!list.creationTime && (
          <MenuItem onClick={handleSave}>
            <ListItemIcon>
              <SaveIcon sx={{ color: theme.palette.text.disabled }} />
            </ListItemIcon>
            <ListItemText>Save</ListItemText>
          </MenuItem>
        )}
        {list.creationTime && (
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteOutlinedIcon sx={sxIcon} />
            </ListItemIcon>
            <ListItemText>Delete List</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleLoad}>
          <ListItemIcon>
            <FolderOpenIcon sx={sxIcon} />
          </ListItemIcon>
          <ListItemText>Open a List</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloudShare} disabled={!list.creationTime}>
          <ListItemIcon>
            <ShareIcon sx={sxIcon} />
          </ListItemIcon>
          <ListItemText>Cloud Share</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <DownloadFileIcon fill={theme.palette.text.disabled} />
          </ListItemIcon>
          <ListItemText>Export as Army Forge File</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleTextExport}>
          <ListItemIcon>
            <AssignmentOutlinedIcon sx={sxIcon} />
          </ListItemIcon>
          <ListItemText>Export as Text</ListItemText>
        </MenuItem>
        {!isLive && <MenuItem onClick={handleShareTTS}>Export as TTS File</MenuItem>}
        <Divider />
        <MenuItem onClick={openOprWebapp}>Open OPR Webapp</MenuItem>
        <MenuItem onClick={() => dispatch(setOpenReleaseNotes(true))}>Open Release Notes</MenuItem>
        <MenuItemDarkMode />
        {!isLive && (
          <MenuItem onClick={() => document.documentElement.requestFullscreen()}>
            Open Fullscreen
          </MenuItem>
        )}
      </Menu>
      <Snackbar
        open={showTextCopiedAlert}
        onClose={() => setShowTextCopiedAlert(false)}
        message="Army list copied to your clipboard."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={4000}
      />
      <CloudShare
        status={cloudShareStatus}
        setStatus={setCloudShareStatus}
        onCancelRequested={() => {
          setCloudShareStatus(CloudShareStatus.none);
        }}
      />
    </>
  );
}

enum CloudShareStatus {
  none,
  uploading,
  success,
  failed,
}

interface CloudShareProps {
  status: CloudShareStatus;
  setStatus: (status: CloudShareStatus) => void;
  onCancelRequested: () => void;
}

function CloudShare({ status, setStatus, onCancelRequested }: CloudShareProps) {
  return (
    <>
      <Snackbar
        open={status === CloudShareStatus.uploading}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <LinearProgress />
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={onCancelRequested}>
                Cancel
              </Button>
            }
          >
            Uploading your list...
          </Alert>
        </div>
      </Snackbar>
      <Snackbar
        open={status === CloudShareStatus.success}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={4000}
        onClose={() => setStatus(CloudShareStatus.none)}
      >
        <Alert severity="success">Upload success. Link copied to clipboard!</Alert>
      </Snackbar>
      <Snackbar
        open={status === CloudShareStatus.failed}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={4000}
        onClose={() => setStatus(CloudShareStatus.none)}
      >
        <Alert severity="error">Upload failed!</Alert>
      </Snackbar>
    </>
  );
}

function MenuItemDarkMode() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.app.darkMode);
  if (darkMode === undefined) return null;
  const toggle = () => {
    dispatch(setDarkMode(!darkMode));
  };
  return (
    <MenuItem onClick={() => toggle()}>
      <span style={{ flex: 1 }}>Dark Mode</span>
      <Checkbox sx={{ p: 0 }} checked={darkMode ?? false} />{" "}
    </MenuItem>
  );
}
