import { DeleteOutline, LinkOutlined } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Chip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  listItemIconClasses,
  ListItemText,
} from "@mui/material";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

import { TaskActionButton } from "@/client/task_compose";

export const enum DownloadEngine {
  Aria2 = "aria2c",
}

export interface HistoryItemProps {
  id: string;
  link: string;
  path: string;
  engine: DownloadEngine;
  name: string;
  onDelete: (id: string) => void;
}

function HistoryItem({
  link,
  id,
  onDelete,
  engine,
  path,
  name,
}: HistoryItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={({ palette }) => ({
          bgcolor: palette.background.paper,
          ":hover": { bgcolor: palette.background.paper },
          borderRadius: "8px",
          [`& .${listItemIconClasses.root}`]: {
            minWidth: "40px",
          },
        })}
      >
        <ListItemIcon>
          <Checkbox edge="start" />
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Chip
                label={engine}
                size="small"
                variant="outlined"
                color="primary"
              />
              <Chip label={path} size="small" variant="outlined" />
            </Box>
          }
        />

        <Box>
          <TaskActionButton
            icon={<LinkOutlined />}
            onClick={() => writeText(link)}
          />
          <TaskActionButton
            icon={<DeleteOutline />}
            onClick={() => onDelete(id)}
          />
        </Box>
      </ListItemButton>
    </ListItem>
  );
}

export default HistoryItem;
