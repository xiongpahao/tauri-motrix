import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

import { getAria2Info } from "@/services/cmd";
import { useTaskStore } from "@/store/task";

export interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

function AddTaskDialog({ onClose, open }: AddTaskModalProps) {
  const { t } = useTranslation();

  const { addTask } = useTaskStore();

  const { data: aria2Info } = useSWR("getAria2Info", getAria2Info);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const link = formData.get("link") as string;

    await addTask(link);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit,
        },
      }}
    >
      <DialogTitle>{t("common.DownloadFile")}</DialogTitle>
      <DialogContent
        sx={{
          "& > :not(:last-child)": {
            mb: 2,
          },
          "& .MuiBox-root": {
            display: "inline-flex",
            width: "100%",
            gap: 2,
          },
        }}
      >
        <TextField
          required
          variant="standard"
          label={t("common.DownloadLink")}
          fullWidth
          name="link"
        />

        <Box>
          <TextField
            variant="standard"
            label={t("common.Rename")}
            name="filename"
            sx={{ flex: "1 1 auto" }}
          />
          <TextField
            name="split"
            variant="standard"
            type="number"
            label={t("task.Splits")}
            defaultValue={aria2Info?.split}
            disabled={!aria2Info?.split}
            sx={{ width: 80 }}
          />
        </Box>

        <TextField
          variant="standard"
          label={t("common.DownloadPath")}
          fullWidth
          disabled={!aria2Info?.dir}
          defaultValue={aria2Info?.dir}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t("common.Cancel")}
        </Button>
        <Button autoFocus type="submit">
          {t("common.Submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTaskDialog;
