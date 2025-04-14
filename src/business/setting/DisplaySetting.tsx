import { MenuItem, Select, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

import ThemeModeSwitch from "@/business/setting/ThemeModeSwitch";
import { SettingItem, SettingList } from "@/client/setting_compose";
import { AVAILABLE_LANGUAGES } from "@/constant/language";
import { useMotrix } from "@/hooks/motrix";
import { getLanguage } from "@/utils/i18n";

function AppearanceSetting() {
  const { t, i18n } = useTranslation("setting");
  const { motrix } = useMotrix();

  return (
    <SettingList title={t("Display")}>
      <SettingItem label={t("ThemeMode")}>
        <ThemeModeSwitch />
      </SettingItem>

      <SettingItem label={t("AutoHideWindow")}>
        <Switch checked={motrix?.app_hide_window} />
      </SettingItem>

      <SettingItem label={t("Language")}>
        <Select
          size="small"
          value={getLanguage(i18n.language)}
          onChange={(value) => {
            i18n.changeLanguage(value.target.value);
          }}
        >
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
