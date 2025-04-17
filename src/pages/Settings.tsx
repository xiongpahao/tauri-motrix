import { Grid, useColorScheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import AppearanceSetting from "@/business/setting/DisplaySetting";
import MotrixSetting from "@/business/setting/MotrixSetting";
import BasePage from "@/components/BasePage";

function SettingsPage() {
  const { t } = useTranslation();

  const { mode } = useColorScheme();

  const isDark = mode === "dark";

  return (
    <BasePage title={t("Settings")}>
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
            md: 6,
            sm: 12,
          }}
        >
          <AppearanceSetting />
        </Grid>

        <Grid
          size={{
            md: 6,
            sm: 12,
          }}
        >
          <MotrixSetting />
        </Grid>
      </Grid>
    </BasePage>
  );
}

export default SettingsPage;
