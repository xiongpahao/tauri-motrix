import { Button, ButtonGroup, useColorScheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export const THEME_MODES = ["light", "dark", "system"] as const;

function ThemeModeSwitch() {
  const { t } = useTranslation();
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <ButtonGroup size="small" sx={{ my: "4px" }}>
      {THEME_MODES.map((value) => (
        <Button
          key={value}
          onClick={() => setMode(value)}
          variant={value === mode ? "contained" : "outlined"}
        >
          {t(`ThemeMode.${value}`)}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default ThemeModeSwitch;
