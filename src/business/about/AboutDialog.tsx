import { List, ListItem, ListItemText } from "@mui/material";
import { version as appVersion } from "@root/package.json";
import { useBoolean } from "ahooks";
import { Ref, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";

import { BaseDialog, DialogRef } from "@/components/BaseDialog";
import { useAria2 } from "@/hooks/aria2";

function AboutDialog(props: { ref: Ref<DialogRef> }) {
  const { t } = useTranslation();
  const [open, { setFalse, setTrue }] = useBoolean();

  const { version } = useAria2();

  useImperativeHandle(props.ref, () => ({
    open: setTrue,
    close: setFalse,
  }));

  return (
    <BaseDialog
      disableCancel
      title={t("about.Title")}
      open={open}
      onClose={setFalse}
      onOk={setFalse}
      okBtn={t("common.Ok")}
    >
      <List>
        <ListItem>
          <ListItemText primary={`aria2 version v${version}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`motrix version v${appVersion}`} />
        </ListItem>
      </List>
    </BaseDialog>
  );
}

export default AboutDialog;
