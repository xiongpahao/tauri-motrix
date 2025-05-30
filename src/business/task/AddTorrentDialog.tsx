import { TextField } from "@mui/material";
import { useBoolean } from "ahooks";
import { remote } from "parse-torrent";
import { Key, Ref, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

import TaskFiles, { TaskFile } from "@/business/task/TaskFiles";
import { BaseDialog, DialogRef } from "@/components/BaseDialog";
import InputFileUpload from "@/components/InputFileUpload";
import { listTorrentFiles } from "@/utils/file";

function AddTorrentDialog(props: { ref: Ref<DialogRef> }) {
  const { t } = useTranslation();
  const [open, { setFalse, setTrue }] = useBoolean();

  const [torrentFiles, setTorrentFiles] = useState<TaskFile[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [selectedTorrentFileKeys, setSelectedTorrentFileKeys] = useState<Key[]>(
    [],
  );

  useImperativeHandle(props.ref, () => ({ close: setFalse, open: setTrue }));

  const submit = () => {
    if (selectedTorrentFileKeys.length === 0) {
      return;
    }
  };

  return (
    <BaseDialog
      open={open}
      title={t("common.DownloadFile")}
      okBtn={t("common.Submit")}
      cancelBtn={t("common.Cancel")}
      onCancel={setFalse}
      onClose={setFalse}
      disableOk={!torrentFiles?.length}
      onOk={submit}
    >
      <InputFileUpload
        accept=".torrent"
        fileList={fileList}
        onChange={(files) => {
          setFileList(files);
          if (!files.length) {
            setTorrentFiles([]);
            return;
          }
          const file = files[0];

          remote(file, (err, parsedTorrent) => {
            if (err) {
              throw err;
            }
            setTorrentFiles(listTorrentFiles(parsedTorrent?.files) ?? []);
          });
        }}
      />
      {!!torrentFiles?.length && (
        <>
          <TaskFiles
            files={torrentFiles}
            selectedRowKeys={selectedTorrentFileKeys}
            onSelectionChange={(keys) => setSelectedTorrentFileKeys(keys)}
          />
          <TextField sx={{ mt: 2 }} label="Rename" fullWidth />
          <TextField sx={{ mt: 2 }} label="Rename" fullWidth />
          <TextField sx={{ mt: 2 }} label="Rename" fullWidth />
        </>
      )}
    </BaseDialog>
  );
}

export default AddTorrentDialog;
