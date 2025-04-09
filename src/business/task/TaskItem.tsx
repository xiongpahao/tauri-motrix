import {
  CloseOutlined,
  FileOpenOutlined,
  InfoOutlined,
  LinkOutlined,
  PauseOutlined,
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
import { TASK_STATUS_ENUM } from "@/constant/task";
import { Aria2Task } from "@/services/aria2c_api";
import parseByteVo from "@/utils/download";
import { getTaskName, timeFormat, timeRemaining } from "@/utils/task";

export interface TaskItemProps {
  task: Aria2Task;
  selected: boolean;
  onSelect: (taskId: string) => void;
  onPause: (taskId: string) => void;
  onResume: (taskId: string) => void;
  onStop: (taskId: string) => void;
  onOpenFile: (taskId: string) => void;
  onCopyLink: (task: string) => void;
}

function TaskItem({
  onSelect,
  task,
  selected,
  onPause,
  onResume,
  onStop,
  onOpenFile,
  onCopyLink,
}: TaskItemProps) {
  const { t } = useTranslation("task");

  const { connections, gid, status } = task;

  const totalLength = Number(task.totalLength);
  const completedLength = Number(task.completedLength);
  const downloadSpeed = Number(task.downloadSpeed) || 0;

  const speedVo = parseByteVo(downloadSpeed, "/s").join("");
  const isDownloading = status === TASK_STATUS_ENUM.Active;

  const progress = (completedLength / totalLength) * 100 || 0;

  const renderActionButton = () => (
    <Box>
      <TaskActionButton
        title={t("Pause")}
        onClick={() => (isDownloading ? onPause(gid) : onResume(gid))}
        icon={isDownloading ? <PauseOutlined /> : <PlayArrowOutlined />}
      />
      <TaskActionButton
        title={t("Close")}
        onClick={() => onStop(gid)}
        icon={<CloseOutlined />}
      />
      <TaskActionButton
        title={t("OpenFile")}
        icon={<FileOpenOutlined />}
        onClick={() => onOpenFile(task.gid)}
      />

      <TaskActionButton
        title={t("CopyLink")}
        icon={<LinkOutlined />}
        onClick={() => onCopyLink(task.gid)}
      />

      <TaskActionButton title={t("Info")} icon={<InfoOutlined />} />
    </Box>
  );

  return (
    <div>
      <ListItem
        sx={{ bgcolor: "background.paper" }}
        secondaryAction={
          <Box sx={{ textAlign: "end" }}>
            {renderActionButton()}
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
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </div>
  );
}

export default TaskItem;
