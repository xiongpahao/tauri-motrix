import { ArrowDownwardOutlined, HubOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";

export function TaskDownloadDescription() {
  const iconStyle: CSSProperties = { fontSize: "14px" };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        fontSize: "12px",
        alignItems: "center",
        color: "#9B9B9B",
      }}
    >
      <TaskDownloadDescriptionIconWithText
        icon={<ArrowDownwardOutlined style={iconStyle} />}
        text="962.5 KB/s"
      />
      <span>Remaining 44m 11s</span>
      <TaskDownloadDescriptionIconWithText
        icon={<HubOutlined style={iconStyle} />}
        text="64"
      />
    </Box>
  );
}

export function TaskDownloadDescriptionIconWithText(props: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
      {props.icon}
      <span>{props.text}</span>
    </Box>
  );
}

export function TaskActionButton(props: {
  title?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <IconButton size="small" onClick={props.onClick} title={props.title}>
      {props.children}
    </IconButton>
  );
}
