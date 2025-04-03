import {
  CloseOutlined,
  FileOpenOutlined,
  InfoOutlined,
  LinkOutlined,
  PlayArrowOutlined,
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { TaskDownloadDescription } from "@/client/task_compose";

export interface TaskItemProps {
  onSelect: (task: undefined) => void;
}

function TaskItem() {
  const { t } = useTranslation("task");

  return (
    <div>
      <ListItem
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <ListItemIcon>
          <Checkbox edge="start" tabIndex={-1} disableRipple />
        </ListItemIcon>

        <ListItemText primary="Filename" secondary="2.36 GB / 5.91 GB" />

        <Box sx={{ textAlign: "end" }}>
          <Box>
            <IconButton size="small">
              <PlayArrowOutlined />
            </IconButton>

            <IconButton size="small" title={t("CloseAllTasks")}>
              <CloseOutlined />
            </IconButton>

            <IconButton size="small">
              <FileOpenOutlined />
            </IconButton>

            <IconButton size="small">
              <LinkOutlined />
            </IconButton>

            <IconButton size="small">
              <InfoOutlined />
            </IconButton>
          </Box>
          <TaskDownloadDescription />
        </Box>
      </ListItem>

      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </div>
  );
}

export default TaskItem;
