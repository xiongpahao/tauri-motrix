import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

import { addTaskApi } from "@/services/aria2c_api";
import { getAria2Info } from "@/services/cmd";

export interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

function AddTaskModal({ onClose, open }: AddTaskModalProps) {
  const { t } = useTranslation("common");

  const [downloadLink, setDownloadLink] = useState("");

  const { data: aria2Info } = useSWR("getAria2Info", getAria2Info);

  const onSubmit = () => {
    if (!downloadLink) {
      return;
    }

    addTaskApi(downloadLink).then((res) => {
      console.log("addTaskApi", res);
    });

    setDownloadLink("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          px: 4,
          py: 3,
        }}
      >
        <Typography>{t("DownloadFile")}</Typography>

        <TextField
          label={t("DownloadLink")}
          fullWidth
          onChange={(e) => setDownloadLink(e.target.value)}
          value={downloadLink}
          sx={{ mt: 2 }}
        />

        <TextField
          label={t("DownloadPath")}
          fullWidth
          sx={{ mt: 2 }}
          disabled={!aria2Info?.dir}
          defaultValue={aria2Info?.dir}
        />

        <Box sx={{ display: "flex", mt: 2, justifyContent: "end", gap: 2 }}>
          <Button variant="contained" onClick={onSubmit}>
            {t("Submit")}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            {t("Cancel")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddTaskModal;
