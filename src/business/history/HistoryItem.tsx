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
import { DownloadHistory } from "@/services/download_history";

export interface HistoryItemProps {
  history: DownloadHistory;
  onDelete: (id: DownloadHistory["id"]) => void;
}

function HistoryItem({ history, onDelete }: HistoryItemProps) {
  const { engine, id, link, name, path } = history;

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
          slots={{
            secondary: "div",
          }}
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
