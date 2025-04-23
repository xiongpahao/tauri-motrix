import { MenuItem, Select, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

import ThemeModeSwitch from "@/business/setting/ThemeModeSwitch";
import { SettingItem, SettingList } from "@/client/setting_compose";
import { AVAILABLE_LANGUAGES } from "@/constant/language";
import { useMotrix } from "@/hooks/motrix";
import { getLanguage } from "@/services/i18n";

function AppearanceSetting() {
  const { t, i18n } = useTranslation();
  const { motrix, patchMotrix } = useMotrix();

  return (
    <SettingList title={t("setting.Display")}>
      <SettingItem label={t("setting.ThemeMode")}>
        <ThemeModeSwitch />
      </SettingItem>

      {/* <SettingItem label={t("setting.AutoHideWindow")}>
        <Switch checked={!!motrix?.app_hide_window} />
      </SettingItem> */}

      <SettingItem label={t("setting.Language")}>
        <Select
          size="small"
          value={getLanguage(motrix?.language ?? i18n.language)}
          onChange={(value) => patchMotrix({ language: value.target.value })}
          sx={{ "> div": { py: "7.5px" } }}
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
