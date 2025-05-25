import { useBoolean } from "ahooks";
import { Ref, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

import { BaseDialog, DialogRef } from "@/components/BaseDialog";
import InputFileUpload from "@/components/InputFileUpload";

function AddTorrentDialog(props: { ref: Ref<DialogRef> }) {
  const { t } = useTranslation();
  const [open, { setFalse, setTrue }] = useBoolean();

  const [currentFile, setCurrentFile] = useState<File>();

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
        onChange={(files) => setCurrentFile(files[0])}
      />
      {currentFile ? <></> : <></>}
    </BaseDialog>
  );
}

export default AddTorrentDialog;
