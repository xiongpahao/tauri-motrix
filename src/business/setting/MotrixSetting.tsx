import { useTranslation } from "react-i18next";

import { SettingItem, SettingList } from "@/client/setting_compose";
import { useMotrix } from "@/hooks/motrix";
import { openAppDir, openCoreDir, openLogsDir } from "@/services/cmd";

function MotrixSetting() {
  const { motrix } = useMotrix();
  const { t } = useTranslation();

  return (
    <SettingList title={t("setting.Motrix")}>
      <SettingItem label={t("setting.OpenConfDir")} onClick={openAppDir} />
      <SettingItem label={t("setting.OpenCoreDir")} onClick={openCoreDir} />
      <SettingItem label={t("setting.OpenLogsDir")} onClick={openLogsDir} />
    </SettingList>
  );
}

export default MotrixSetting;
