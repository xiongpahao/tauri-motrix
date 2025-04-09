import {
  ArrowDownwardOutlined,
  HourglassEmpty,
  HubOutlined,
} from "@mui/icons-material";
import { Box, IconButton, List } from "@mui/material";
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
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
}) {
  return (
    <IconButton size="small" onClick={props.onClick} title={props.title}>
      {props.icon}
    </IconButton>
  );
}

export function TaskList<T>(props: {
  dataSource: T[];
  renderItem: (item: T) => ReactNode;
}) {
  const { dataSource, renderItem } = props;

  if (!dataSource.length) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HourglassEmpty />
      </Box>
    );
  }

  return (
    <List
      disablePadding
      sx={{
        "& > :not(:last-child)": {
          "margin-block-end": 16,
        },
      }}
    >
      {dataSource.map(renderItem)}
    </List>
  );
}
