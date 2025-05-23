import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import { styled, SxProps, Theme } from "@mui/material/styles";
import { Ref } from "react";
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
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

  return (
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
        onChange={onChange}
        multiple={multiple}
        accept={accept}
        ref={ref}
      />
    </Button>
  );
}
