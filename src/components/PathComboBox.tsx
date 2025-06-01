import { Folder, History } from "@mui/icons-material";
import { IconButton, TextField, TextFieldProps } from "@mui/material";
import { open as dialogOpen } from "@tauri-apps/plugin-dialog";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

export type PathComboBoxProps = {
  openTitle?: string;
  value?: string;
  setValue?: (value: string) => void;
} & TextFieldProps;

function PathComboBox(props: PathComboBoxProps) {
  const { setValue, openTitle, ...innerProps } = props;
  const value = innerProps.value;

  const { t } = useTranslation();

  const pathRef = useRef("");

  if (value) {
    pathRef.current = value;
  }

  const onFolderPick = useCallback(async () => {
    const folder = await dialogOpen({
      directory: true,
      multiple: false,
      title: t(openTitle ?? "common.DirPick"),
    });

    if (folder) {
      pathRef.current = folder;
      setValue?.(folder);
    }
  }, [openTitle, setValue, t]);

  return (
    <TextField
      fullWidth
      label={t("common.DownloadPath")}
      variant="outlined"
      size="small"
      slotProps={{
        input: {
          endAdornment: (
            <IconButton size="small" onClick={onFolderPick}>
              <Folder />
            </IconButton>
          ),
          startAdornment: (
            <IconButton size="small">
              <History />
            </IconButton>
          ),
        },
      }}
      {...innerProps}
    />
  );
}

export default PathComboBox;
