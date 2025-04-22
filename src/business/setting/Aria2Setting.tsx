import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import ExternalControllerDialog from "@/business/setting/ExternalControllerDialog";
import { SettingItem, SettingList } from "@/client/setting_compose";
import { DialogRef } from "@/components/BaseDialog";
import { useAria2 } from "@/hooks/aria2";
import { patchAria2Config } from "@/services/cmd";

window.a = patchAria2Config;

function Aria2Setting() {
  const { t } = useTranslation();

  const externalRef = useRef<DialogRef>(null);

  const { patchConfig, aria2 } = useAria2();

  const [uploadLimit, setUploadLimit] = useState(0);
  const [downloadLimit, setDownloadLimit] = useState(0);

  useEffect(() => {
    if (aria2) {
      setUploadLimit(Number(aria2["max-upload-limit"]));
      setDownloadLimit(Number(aria2["max-download-limit"]));
    }
  }, [aria2]);

  return (
    <SettingList title={t("setting.Aria2")}>
      <ExternalControllerDialog ref={externalRef} />

      <SettingItem
        label={t("setting.External")}
        onClick={() => externalRef.current?.open()}
      />

      <SettingItem label={"Upload speed limit"}>
        <TextField
          type="number"
          size="small"
          label="KB/s"
          sx={{ width: 100 }}
          value={uploadLimit}
        />
      </SettingItem>

      <SettingItem label={"Download speed limit"}>
        <TextField
          type="number"
          size="small"
          label="KB/s"
          sx={{ width: 100 }}
          value={downloadLimit}
        />
      </SettingItem>
    </SettingList>
  );
}

export default Aria2Setting;
