import { Box, TextField, textFieldClasses } from "@mui/material";
import { useBoolean } from "ahooks";
import { Ref, useImperativeHandle } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { BaseDialog, DialogRef } from "@/components/BaseDialog";
import { Notice } from "@/components/Notice";
import { useAria2 } from "@/hooks/aria2";

interface IForm {
  maxConcurrentDownloads: number;
  maxConnectionPerServer: number;
}

// TODO: ui upgrade
function TaskManagementDialog(props: { ref: Ref<DialogRef> }) {
  const { t } = useTranslation();
  const [open, { setTrue, setFalse }] = useBoolean();

  const { aria2, patchAria2 } = useAria2();

  useImperativeHandle(props.ref, () => ({
    close: setFalse,
    open: setTrue,
  }));

  const maxConcurrentDownloads =
    Number(aria2?.["max-concurrent-downloads"]) || 0;
  const maxConnectionPerServer =
    Number(aria2?.["max-connection-per-server"]) || 0;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForm>({
    values: {
      maxConcurrentDownloads,
      maxConnectionPerServer,
    },
  });

  const onClose = () => {
    setFalse();
    reset();
  };

  const updateConfig: SubmitHandler<IForm> = async ({
    maxConcurrentDownloads,
    maxConnectionPerServer,
  }) => {
    await patchAria2({
      "max-concurrent-downloads": maxConcurrentDownloads.toString(),
      "max-connection-per-server": maxConnectionPerServer.toString(),
    });

    Notice.success(t("common.SaveSuccess"));
    onClose();
  };

  return (
    <BaseDialog
      title={t("setting.TaskManagement")}
      open={open}
      onClose={setFalse}
      onCancel={setFalse}
      okBtn={t("common.Save")}
      cancelBtn={t("common.Cancel")}
      enableForm
      onSubmit={handleSubmit(updateConfig)}
    >
      <Box
        sx={{
          [`.${textFieldClasses.root}`]: {
            mt: 2,
          },
        }}
      >
        <Controller
          control={control}
          name="maxConcurrentDownloads"
          rules={{
            min: 1,
            max: 10,
          }}
          render={({ field }) => (
            <TextField
              type="number"
              fullWidth
              label={t("setting.MaxConcurrentTasks")}
              size="small"
              error={!!errors.maxConcurrentDownloads}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="maxConnectionPerServer"
          rules={{
            min: 1,
            max: 128,
          }}
          render={({ field }) => (
            <TextField
              type="number"
              fullWidth
              label={t("setting.MaxConnectionPerServer")}
              size="small"
              error={!!errors.maxConnectionPerServer}
              {...field}
            />
          )}
        />
      </Box>
    </BaseDialog>
  );
}

export default TaskManagementDialog;
