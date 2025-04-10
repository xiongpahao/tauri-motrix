import { FolderOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { open as dialogOpen } from "@tauri-apps/plugin-dialog";
import { FormEvent, useRef } from "react";
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

  const dirInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const link = formData.get("link") as string;
    const out = formData.get("filename") as string;
    const dir = formData.get("dir") as string;
    const split = Number(formData.get("split"));

    await addTask(link, {
      dir,
      split,
      out,
    });
    onClose();
  };

  const onFolderPick = async () => {
    const folder = await dialogOpen({
      directory: true,
      multiple: false,
      title: t("task.DirPick"),
    });

    if (folder) {
      dirInputRef.current!.value = folder;
    }
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

        <Box>
          <TextField
            inputRef={dirInputRef}
            name="dir"
            variant="standard"
            label={t("common.DownloadPath")}
            fullWidth
            disabled
            defaultValue={aria2Info?.dir}
          />
          <IconButton onClick={onFolderPick}>
            <FolderOutlined />
          </IconButton>
        </Box>
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
