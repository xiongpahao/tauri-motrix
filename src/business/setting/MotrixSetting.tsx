import { MenuItem, Select } from "@mui/material";
import { check as checkUpdate } from "@tauri-apps/plugin-updater";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import UpdateViewer from "@/business/update/UpdateViewer";
import { SettingItem, SettingList } from "@/client/setting_compose";
import { DialogRef } from "@/components/BaseDialog";
import { Notice } from "@/components/Notice";
import { LOG_LEVELS } from "@/constant/log";
import { useMotrix } from "@/hooks/motrix";
import { exitApp, openAppDir, openCoreDir, openLogsDir } from "@/services/cmd";

function MotrixSetting() {
  const { motrix, patchMotrix } = useMotrix();
  const { t } = useTranslation();

  const updateRef = useRef<DialogRef>(null);

  const onCheckUpdate = async () => {
    try {
      const info = await checkUpdate();
      if (!info) {
        Notice.success(t("update.CurrentlyOnLatest"));
      } else {
        updateRef.current?.open();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Notice.error(err.message || err.toString());
    }
  };

  return (
    <SettingList title={t("setting.Motrix")}>
      <UpdateViewer ref={updateRef} />

      <SettingItem label={t("setting.LogLevelInfo")}>
        <Select
          value={motrix?.app_log_level ?? "info"}
          size="small"
          sx={{ width: 100, "> div": { py: "7.5px" } }}
          onChange={async (e) => {
            await patchMotrix({
              app_log_level: e.target.value as MotrixConfig["app_log_level"],
            });
            Notice.success(t("common.SaveSuccess"));
          }}
        >
          {LOG_LEVELS.map(({ label, value }) => (
            <MenuItem value={value}>{label}</MenuItem>
          ))}
        </Select>
      </SettingItem>

      <SettingItem label={t("setting.OpenConfDir")} onClick={openAppDir} />
      <SettingItem label={t("setting.OpenCoreDir")} onClick={openCoreDir} />
      <SettingItem label={t("setting.OpenLogsDir")} onClick={openLogsDir} />
      <SettingItem
        label={t("setting.CheckForUpdates")}
        onClick={onCheckUpdate}
      />
      <SettingItem label={t("common.Exit")} onClick={exitApp} />
    </SettingList>
  );
}

export default MotrixSetting;
