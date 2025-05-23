import { useBoolean } from "ahooks";
import { Ref, useImperativeHandle, useRef } from "react";
import { useTranslation } from "react-i18next";

import { BaseDialog, DialogRef } from "@/components/BaseDialog";
import InputFileUpload from "@/components/InputFileUpload";

function AddTorrentDialog(props: { ref: Ref<DialogRef> }) {
  const { t } = useTranslation();
  const [open, { setFalse, setTrue }] = useBoolean();

  const fileRef = useRef<File>(null);

  useImperativeHandle(props.ref, () => ({ close: setFalse, open: setTrue }));

  return (
    <BaseDialog
      open={open}
      title={t("common.DownloadFile")}
      okBtn={t("common.Submit")}
      cancelBtn={t("common.Cancel")}
      onCancel={setFalse}
      onClose={setFalse}
      //   onOk={}
    >
      <InputFileUpload
        accept=".torrent"
        onChange={(e) => {
          if (!e.target.files) {
            return;
          }
          fileRef.current = e.target.files[0];
        }}
      />
    </BaseDialog>
  );
}

export default AddTorrentDialog;
