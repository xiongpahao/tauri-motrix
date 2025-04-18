import {
  List,
  ListItem,
  listItemClasses,
  ListItemText,
  TextField,
} from "@mui/material";
import { useLockFn } from "ahooks";
import { Ref, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

import { BaseDialog, DialogRef } from "@/components/BaseDialog";
import { Notice } from "@/components/Notice";
import { useAria2Info } from "@/hooks/aria2";

function ExternalControllerDialog(props: { ref: Ref<DialogRef> }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { aria2Info, patchInfo } = useAria2Info();

  const [controller, setController] = useState(aria2Info?.server ?? "");

  useImperativeHandle(props.ref, () => ({
    open() {
      setOpen(true);
    },
    close() {
      setOpen(false);
    },
  }));

  const onSave = useLockFn(async () => {
    try {
      await patchInfo({ "external-controller": controller });
      Notice.success(t("setting.ExternalControllerAddressModified"), 1000);
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Notice.error(err?.message || err?.toString(), 4000);
    }
  });

  return (
    <BaseDialog
      open={open}
      title={t("setting.ExternalController")}
      contentSx={{ width: 400 }}
      okBtn={t("common.Save")}
      cancelBtn={t("common.Cancel")}
      onClose={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      onOk={onSave}
    >
      <List
        sx={{
          [`.${listItemClasses.root}`]: {
            padding: "5px 2px",
          },
        }}
      >
        <ListItem>
          <ListItemText primary={t("setting.ExternalController")} />
          <TextField
            autoComplete="new-password"
            size="small"
            sx={{ width: 175 }}
            value={controller}
            placeholder="Required"
            onChange={(e) => setController(e.target.value)}
          />
        </ListItem>

        {/*  TODO: secret */}
      </List>
    </BaseDialog>
  );
}

export default ExternalControllerDialog;
