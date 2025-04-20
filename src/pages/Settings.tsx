import { GitHub, HelpOutlineRounded } from "@mui/icons-material";
import { ButtonGroup, Grid, IconButton, useColorScheme } from "@mui/material";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useLockFn } from "ahooks";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import AboutDialog from "@/business/about/AboutDialog";
import Aria2Setting from "@/business/setting/Aria2Setting";
import AppearanceSetting from "@/business/setting/DisplaySetting";
import MotrixSetting from "@/business/setting/MotrixSetting";
import { DialogRef } from "@/components/BaseDialog";
import BasePage from "@/components/BasePage";
import { APP_REPO } from "@/constant/url";

function SettingsPage() {
  const { t } = useTranslation();

  const { mode } = useColorScheme();

  const isDark = mode === "dark";

  const toGithubRepo = useLockFn(() => openUrl(APP_REPO));

  const aboutRef = useRef<DialogRef>(null);

  return (
    <BasePage
      title={t("Settings")}
      header={
        <ButtonGroup>
          <AboutDialog ref={aboutRef} />

          <IconButton
            size="medium"
            color="inherit"
            title={t("Manual")}
            onClick={() => aboutRef.current?.open()}
          >
            <HelpOutlineRounded fontSize="inherit" />
          </IconButton>
          <IconButton
            size="medium"
            color="inherit"
            title={t("Github Repo")}
            onClick={toGithubRepo}
          >
            <GitHub fontSize="inherit" />
          </IconButton>
        </ButtonGroup>
      }
    >
      <Grid
        container
        spacing={2}
        sx={{
          "& .MuiGrid-root": {
            borderRadius: 2,
            marginBottom: 1.5,
            backgroundColor: isDark ? "#282a36" : "#ffffff",
          },
        }}
      >
        <Grid
          size={{
            lg: 4,
            md: 6,
            xs: 12,
          }}
        >
          <AppearanceSetting />
        </Grid>

        <Grid
          size={{
            lg: 4,

            md: 6,
            xs: 12,
          }}
        >
          <MotrixSetting />
        </Grid>

        <Grid
          size={{
            lg: 4,

            md: 6,
            xs: 12,
          }}
        >
          <Aria2Setting />
        </Grid>
      </Grid>
    </BasePage>
  );
}

export default SettingsPage;
