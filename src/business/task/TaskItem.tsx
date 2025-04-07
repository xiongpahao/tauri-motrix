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
  LinearProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  TaskActionButton,
  TaskDownloadDescription,
} from "@/client/task_compose";
import { Aria2Task } from "@/services/aria2c_api";

export interface TaskItemProps {
  task: Aria2Task;
  onSelect: (task: Aria2Task) => void;
}

function TaskItem({ onSelect, task }: TaskItemProps) {
  const { t } = useTranslation("task");

  return (
    <div>
      <ListItem
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            tabIndex={-1}
            disableRipple
            onChange={() => onSelect(task)}
          />
        </ListItemIcon>

        <ListItemText primary="Filename" secondary="2.36 GB / 5.91 GB" />

        <Box sx={{ textAlign: "end" }}>
          <Box>
            <TaskActionButton title={t("Pause")}>
              <PlayArrowOutlined />
            </TaskActionButton>

            <TaskActionButton title={t("Close")}>
              <CloseOutlined />
            </TaskActionButton>

            <TaskActionButton title={t("OpenFile")}>
              <FileOpenOutlined />
            </TaskActionButton>

            <TaskActionButton title={t("CopyLink")}>
              <LinkOutlined />
            </TaskActionButton>

            <TaskActionButton title={t("Info")}>
              <InfoOutlined />
            </TaskActionButton>
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
