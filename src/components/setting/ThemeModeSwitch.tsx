import { Button, ButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

type ThemeMode = "light" | "dark" | "system";

interface ThemeModeSwitchProps {
  value?: ThemeMode;
  onChange?: (value: ThemeMode) => void;
}

const MODES = ["light", "dark", "system"] as const;

function ThemeModeSwitch({ onChange, value }: ThemeModeSwitchProps) {
  const { t } = useTranslation();

  return (
    <ButtonGroup size="small" sx={{ my: "4px" }}>
      {MODES.map((mode) => (
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
