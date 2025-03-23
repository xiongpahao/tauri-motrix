import { MenuItem, Select, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

import ThemeModeSwitch from "@/business/setting/ThemeModeSwitch";
import { SettingItem, SettingList } from "@/client/setting_compose";
import { AVAILABLE_LANGUAGES } from "@/constant/language";

function AppearanceSetting() {
  const { t } = useTranslation("setting");

  return (
    <SettingList title={t("Display")}>
      <SettingItem label={t("ThemeMode")}>
        <ThemeModeSwitch />
      </SettingItem>

      <SettingItem label={t("HideAppMenu")}>
        <Switch />
      </SettingItem>

      <SettingItem label={t("AutoHideWindow")}>
        <Switch />
      </SettingItem>

      <SettingItem label={t("Language")}>
        <Select size="small" value="en-US">
          {AVAILABLE_LANGUAGES.map(({ label, value }) => (
            <MenuItem value={value} key={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </SettingItem>
    </SettingList>
  );
}

export default AppearanceSetting;
