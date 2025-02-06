import { SettingItem, SettingList } from "@/components/setting/SettingCompose";
import ThemeModeSwitch from "@/components/setting/ThemeModeSwitch";
import { MenuItem, Select, Switch } from "@mui/material";

function AppearanceSetting() {
  return (
    <SettingList title="Display">
      <SettingItem label="Theme Mode">
        <ThemeModeSwitch />
      </SettingItem>

      <SettingItem
        label="
            Hide App Menu (Windows & Linux Only)
          "
      >
        <Switch />
      </SettingItem>

      <SettingItem
        label="
            Auto Hide Window
          "
      >
        <Switch />
      </SettingItem>

      <SettingItem label="Language">
        <Select size="small">
          <MenuItem>English</MenuItem>
          <MenuItem>Chinese</MenuItem>
        </Select>
      </SettingItem>
    </SettingList>
  );
}

export default AppearanceSetting;
