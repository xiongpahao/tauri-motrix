import { Button, ButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

import { THEME_MODES, ThemeMode } from "@/constant/theme";

interface ThemeModeSwitchProps {
  value?: ThemeMode;
  onChange?: (value: ThemeMode) => void;
}

function ThemeModeSwitch({ onChange, value }: ThemeModeSwitchProps) {
  const { t } = useTranslation();

  return (
    <ButtonGroup size="small" sx={{ my: "4px" }}>
      {THEME_MODES.map((mode) => (
        <Button
          key={mode}
          onClick={() => onChange?.(mode)}
          variant={mode === value ? "contained" : "outlined"}
        >
          {t(`ThemeMode.${mode}`)}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default ThemeModeSwitch;
