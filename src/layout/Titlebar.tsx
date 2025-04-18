import {
  CloseRounded,
  CropSquareRounded,
  FilterNoneRounded,
  HorizontalRuleRounded,
  PushPinOutlined,
  PushPinRounded,
} from "@mui/icons-material";
import { Box, Button, ButtonGroup, buttonGroupClasses } from "@mui/material";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

const appWindow = getCurrentWindow();

function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isPined, setIsPined] = useState(false);

  useEffect(() => {
    const unlisten = appWindow.onResized(() => {
      appWindow.isMaximized().then(setIsMaximized);
    });

    appWindow.isMaximized().then(setIsMaximized);

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <Box
      sx={({ palette }) => ({
        background: palette.background.paper,
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        appRegion: "drag",
      })}
      data-tauri-drag-region
    >
      <ButtonGroup
        variant="text"
        sx={{
          [`.${buttonGroupClasses.grouped}`]: {
            borderRight: "0px",
            borderRadius: "0px",
          },
        }}
      >
        <Button
          size="small"
          onClick={() => {
            appWindow.setAlwaysOnTop(!isPined);
            setIsPined((isPined) => !isPined);
          }}
        >
          {isPined ? (
            <PushPinRounded fontSize="small" />
          ) : (
            <PushPinOutlined fontSize="small" />
          )}
        </Button>

        <Button size="small" onClick={() => appWindow.minimize()}>
          <HorizontalRuleRounded fontSize="small" />
        </Button>

        <Button
          size="small"
          onClick={() => {
            setIsMaximized((isMaximized) => !isMaximized);
            appWindow.toggleMaximize();
          }}
        >
          {isMaximized ? (
            <FilterNoneRounded
              sx={{ transform: "rotate(180deg) scale(0.7)" }}
              fontSize="small"
            />
          ) : (
            <CropSquareRounded fontSize="small" />
          )}
        </Button>

        <Button
          size="small"
          onClick={() => appWindow.close()}
          sx={{
            ":hover": { bgcolor: "#ff000090" },
            ":hover > svg": { color: "white" },
          }}
        >
          <CloseRounded fontSize="small" />
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default TitleBar;
