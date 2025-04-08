import { ArrowDownwardOutlined, HubOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { useTranslation } from "react-i18next";

export function TaskDownloadDes(props: {
  speed: string;
  connections: string;
  remaining: string;
}) {
  const iconStyle: CSSProperties = { fontSize: "14px" };
  const { t } = useTranslation("common");

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
        text={props.speed}
      />
      <span>
        {t("Remaining")} {props.remaining}
      </span>
      <TaskDownloadDescriptionIconWithText
        icon={<HubOutlined style={iconStyle} />}
        text={props.connections}
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
