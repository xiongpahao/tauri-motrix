import { ArrowDownwardOutlined, HubOutlined } from "@mui/icons-material";
import { Box, IconButton, List } from "@mui/material";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";

import { BaseEmpty } from "@/components/BaseEmpty";

export function TaskDownloadDes(props: {
  speed: string;
  connections: string;
  remaining: string;
}) {
  const iconStyle: CSSProperties = { fontSize: "14px" };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        fontSize: "12px",
        alignItems: "center",
        color: "#9B9B9B",
        textAlign: "end",
      }}
    >
      <TaskDesIconWithText
        icon={<ArrowDownwardOutlined style={iconStyle} />}
        text={props.speed}
      />
      <span>{props.remaining}</span>
      <TaskDesIconWithText
        icon={<HubOutlined style={iconStyle} />}
        text={props.connections}
      />
    </Box>
  );
}

export function TaskDesIconWithText(props: { icon: ReactNode; text: string }) {
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
    return <BaseEmpty text="task.Empty" />;
  }

  return (
    <List
      disablePadding
      sx={{
        "& > :not(:last-child)": {
          marginBlockEnd: 16,
        },
      }}
    >
      {dataSource.map(renderItem)}
    </List>
  );
}
