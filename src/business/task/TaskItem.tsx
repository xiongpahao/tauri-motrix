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

import { TaskActionButton, TaskDownloadDes } from "@/client/task_compose";
import { Aria2Task } from "@/services/aria2c_api";
import parseByteVo from "@/utils/download";
import { getTaskName, timeFormat, timeRemaining } from "@/utils/task";

export interface TaskItemProps {
  task: Aria2Task;
  onSelect: (taskId: Aria2Task["gid"]) => void;
  selected: boolean;
}

function TaskItem({ onSelect, task, selected }: TaskItemProps) {
  const { t } = useTranslation("task");

  const { connections, gid } = task;

  const totalLength = Number(task.totalLength);
  const completedLength = Number(task.completedLength);
  const downloadSpeed = Number(task.downloadSpeed) || 0;

  const speedVo = parseByteVo(downloadSpeed, "/s").join("");

  return (
    <div>
      <ListItem
        sx={{ bgcolor: "background.paper" }}
        secondaryAction={
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
            <TaskDownloadDes
              speed={speedVo}
              connections={connections}
              remaining={timeFormat(
                timeRemaining(totalLength, completedLength, downloadSpeed),
              )}
            />
          </Box>
        }
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            tabIndex={-1}
            disableRipple
            checked={selected}
            onChange={() => onSelect(gid)}
          />
        </ListItemIcon>

        <ListItemText
          primary={getTaskName(task)}
          secondary={`${parseByteVo(completedLength).join("")} / ${parseByteVo(totalLength).join("")}`}
        />
      </ListItem>

      <Box sx={{ width: "100%" }}>
        <LinearProgress value={(completedLength / totalLength) * 100} />
      </Box>
    </div>
  );
}

export default TaskItem;
