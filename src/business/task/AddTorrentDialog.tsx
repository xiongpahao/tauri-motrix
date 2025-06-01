import { Grid, TextField } from "@mui/material";
import { useBoolean } from "ahooks";
import { remote } from "parse-torrent";
import { Key, Ref, useCallback, useImperativeHandle, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import TaskFiles, { TaskFile } from "@/business/task/TaskFiles";
import { BaseDialog, DialogRef } from "@/components/BaseDialog";
import InputFileUpload from "@/components/InputFileUpload";
import PathComboBox from "@/components/PathComboBox";
import { useAria2 } from "@/hooks/aria2";
import { listTorrentFiles } from "@/utils/file";

interface IFormInput {
  out: string;
  split?: number;
  dir: string;
}

function AddTorrentDialog(props: { ref: Ref<DialogRef> }) {
  const { t } = useTranslation();
  const [open, { setFalse, setTrue }] = useBoolean();

  const [torrentFiles, setTorrentFiles] = useState<TaskFile[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [selectedTorrentFileKeys, setSelectedTorrentFileKeys] = useState<Key[]>(
    [],
  );

  const { aria2 } = useAria2();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    values: {
      split: 128,
      dir: aria2?.dir ?? "",
      out: "",
    },
  });

  useImperativeHandle(props.ref, () => ({ close: setFalse, open: setTrue }));

  const setDirValue = useCallback(
    (value: string) => setValue("dir", value),
    [setValue],
  );

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const { out, split, dir } = data;

    console.log("miku ", out, split, dir);
    if (selectedTorrentFileKeys.length === 0) {
      return;
    }

    console.log("miku ");
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
      onSubmit={handleSubmit(onSubmit)}
      enableForm
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
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Controller
                name="out"
                control={control}
                render={({ field }) => (
                  <TextField
                    label={t("common.Rename")}
                    fullWidth
                    placeholder={t("common.Optional")}
                    size="small"
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Controller
                name="split"
                rules={{
                  min: {
                    value: 1,
                    message: t("task.SplitMin", { min: 1 }),
                  },
                  max: {
                    value: 128,
                    message: t("task.SplitMax", { max: 128 }),
                  },
                }}
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    placeholder={t("common.Optional")}
                    size="small"
                    type="number"
                    label={t("task.Splits")}
                    error={!!errors.split}
                    helperText={errors.split?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="dir"
                control={control}
                render={({ field }) => (
                  <PathComboBox
                    setValue={setDirValue}
                    error={!!errors.dir}
                    openTitle="task.DirPick"
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
        </>
      )}
    </BaseDialog>
  );
}

export default AddTorrentDialog;
