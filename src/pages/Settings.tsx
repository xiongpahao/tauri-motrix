import { Box, Grid2, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import AppearanceSetting from "@/business/setting/DisplaySetting";
import BasePage from "@/components/BasePage";

function SettingsPage() {
  const { t } = useTranslation();

  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";
  const boxSx = {
    borderRadius: 2,
    marginBottom: 1.5,
    backgroundColor: isDark ? "#282a36" : "#ffffff",
  };

  return (
    <BasePage title={t("Settings")}>
      <Grid2 container spacing={2}>
        <Box sx={boxSx}>
          <AppearanceSetting />
        </Box>

        <Box sx={boxSx}></Box>
      </Grid2>
    </BasePage>
  );
}

export default SettingsPage;
