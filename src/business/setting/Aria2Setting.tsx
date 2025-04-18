import { useRef } from "react";
import { useTranslation } from "react-i18next";

import ExternalControllerDialog from "@/business/setting/ExternalControllerDialog";
import { SettingItem, SettingList } from "@/client/setting_compose";
import { DialogRef } from "@/components/BaseDialog";

function Aria2Setting() {
  const { t } = useTranslation();

  const externalRef = useRef<DialogRef>(null);

  return (
    <SettingList title={t("setting.Aria2")}>
      <ExternalControllerDialog ref={externalRef} />

      <SettingItem
        label={t("setting.External")}
        onClick={() => externalRef.current?.open()}
      />
    </SettingList>
  );
}

export default Aria2Setting;
