import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import HistoryPathInput from "@/business/history/HistoryPathInput";
import ExternalControllerDialog from "@/business/setting/ExternalControllerDialog";
import SpeedLimitDialog from "@/business/setting/SpeedLimitDialog";
import TaskManagementDialog from "@/business/setting/TaskManagementDialog";
import { SettingItem, SettingList } from "@/client/setting_compose";
import { Android12Switch } from "@/client/styled_compose";
import { DialogRef } from "@/components/BaseDialog";
import { useAria2 } from "@/hooks/aria2";

function Aria2Setting() {
  const { t } = useTranslation();

  const externalRef = useRef<DialogRef>(null);
  const speedLimitRef = useRef<DialogRef>(null);
  const taskManagementRef = useRef<DialogRef>(null);

  const { aria2, patchAria2 } = useAria2();

  const isTrue = useCallback(
    (key: keyof NonNullable<typeof aria2>) => aria2?.[key] === "true",
    [aria2],
  );

  const btAutoDownloadContent =
    isTrue("follow-torrent") &&
    isTrue("follow-metalink") &&
    !isTrue("pause-metadata");

  return (
    <SettingList title={t("setting.Aria2")}>
      <ExternalControllerDialog ref={externalRef} />
      <SpeedLimitDialog ref={speedLimitRef} />
      <TaskManagementDialog ref={taskManagementRef} />

      <SettingItem
        label={t("setting.External")}
        onClick={() => externalRef.current?.open()}
      />

      <SettingItem
        label={t("setting.SpeedLimit")}
        onClick={() => speedLimitRef.current?.open()}
      />

      <SettingItem
        label={t("setting.TaskManagement")}
        onClick={() => taskManagementRef.current?.open()}
      />

      <SettingItem label={t("setting.DefaultPath")}>
        <HistoryPathInput defaultValue={aria2?.dir} sx={{ ml: 2 }} />
      </SettingItem>

      <SettingItem label={t("setting.BtSaveMetadata")}>
        <Android12Switch
          checked={isTrue("bt-save-metadata")}
          onChange={(e) => {
            const checked = e.target.checked;
            patchAria2({ "bt-save-metadata": JSON.stringify(checked) });
          }}
        />
      </SettingItem>

      <SettingItem label={t("setting.BtAutoDownloadContent")}>
        <Android12Switch
          checked={btAutoDownloadContent}
          onChange={(e) => {
            const checked = e.target.checked;
            patchAria2({
              "follow-torrent": JSON.stringify(checked),
              "follow-metalink": JSON.stringify(checked),
              "pause-metadata": JSON.stringify(!checked),
            });
          }}
        />
      </SettingItem>

      <SettingItem label={t("setting.BtForceEncryption")}>
        <Android12Switch
          checked={isTrue("bt-force-encryption")}
          onChange={(e) => {
            const checked = e.target.checked;
            patchAria2({ "bt-force-encryption": JSON.stringify(checked) });
          }}
        />
      </SettingItem>

      <SettingItem label={t("setting.Continue")}>
        <Android12Switch
          checked={isTrue("continue")}
          onChange={(e) => {
            const checked = e.target.checked;
            patchAria2({ continue: JSON.stringify(checked) });
          }}
        />
      </SettingItem>
    </SettingList>
  );
}

export default Aria2Setting;
