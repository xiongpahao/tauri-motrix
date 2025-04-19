import { Box, Button } from "@mui/material";
import { openUrl } from "@tauri-apps/plugin-opener";
import { check as checkUpdate } from "@tauri-apps/plugin-updater";
import { useBoolean } from "ahooks";
import { Ref, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

import { BaseDialog, DialogRef } from "@/components/BaseDialog";
import { APP_REPO } from "@/constant/url";

function UpdateViewer(props: { ref: Ref<DialogRef> }) {
  const { t } = useTranslation();

  const [open, { setTrue, setFalse }] = useBoolean();

  useImperativeHandle(props.ref, () => ({ close: setFalse, open: setTrue }));

  const { data: updateInfo } = useSWR("checkUpdate", checkUpdate, {
    errorRetryCount: 2,
    revalidateIfStale: false,
    focusThrottleInterval: 36e5, // 1 hour
  });

  const onUpdate = async () => {
    // TODO

    if (!updateInfo) {
      return;
    }

    await updateInfo.downloadAndInstall();
  };

  return (
    <BaseDialog
      open={open}
      title={
        <Box display="flex" justifyContent="space-between">
          {`New Version v${updateInfo?.version}`}
          <Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                openUrl(`${APP_REPO}/releases/tag/v${updateInfo?.version}`);
              }}
            >
              {t("update.GotoReleasePage")}
            </Button>
          </Box>
        </Box>
      }
      contentSx={{ minWidth: 360, maxWidth: 400, height: "50vh" }}
      okBtn={t("common.Update")}
      cancelBtn={t("common.Cancel")}
      onClose={setFalse}
      onCancel={setFalse}
      onOk={onUpdate}
    >
      {/* TODO */}
    </BaseDialog>
  );
}

export default UpdateViewer;
