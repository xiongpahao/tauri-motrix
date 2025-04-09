import {
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
  const { t } = useTranslation("common");

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
      <DialogTitle>{t("DownloadFile")}</DialogTitle>
      <DialogContent>
        <TextField
          required
          variant="standard"
          label={t("DownloadLink")}
          fullWidth
          name="link"
          sx={{ mt: 2 }}
        />

        <TextField
          type="number"
          sx={{ mt: 2 }}
          label={t("Splits", { ns: "task" })}
        />

        <TextField
          label={t("DownloadPath")}
          fullWidth
          sx={{ mt: 2 }}
          disabled={!aria2Info?.dir}
          defaultValue={aria2Info?.dir}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button autoFocus type="submit">
          {t("Submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTaskDialog;
