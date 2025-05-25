import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { styled, SxProps, Theme } from "@mui/material/styles";
import { ChangeEvent, Ref, useActionState } from "react";
import { useTranslation } from "react-i18next";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export interface InputFileUploadProps {
  text?: string;
  multiple?: boolean;
  sx?: SxProps<Theme>;
  accept?: string;
  ref?: Ref<HTMLInputElement>;
  onChange?: (files: File[]) => void;
}

export default function InputFileUpload({
  text,
  multiple,
  sx,
  accept,
  ref,
  onChange,
}: InputFileUploadProps) {
  const { t } = useTranslation();

  const [fileNames, onFileInput, isPending] = useActionState<
    string[],
    ChangeEvent<HTMLInputElement>
  >(async (nameList, e) => {
    const files = e.target.files;

    if (!files) {
      return nameList;
    }

    const filesArray = Array.from(files);
    await onChange?.(filesArray);

    return filesArray.map((item) => item.name);
  }, []);

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={sx}
      >
        {t(text ?? "common.UploadFile")}
        <VisuallyHiddenInput
          type="file"
          onChange={onFileInput}
          multiple={multiple}
          accept={accept}
          ref={ref}
        />
      </Button>

      {isPending
        ? "Loading..."
        : fileNames.map((name) => (
            <Typography noWrap sx={{ ml: 1, mt: 1 }}>
              {name}
            </Typography>
          ))}
    </Box>
  );
}
