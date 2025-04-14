import {
  Box,
  Checkbox,
  LinearProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import TaskItemAction from "@/business/task/TaskItemAction";
import { TaskDownloadDes } from "@/client/task_compose";
import { Aria2Task } from "@/services/aria2c_api";
import { parseByteVo } from "@/utils/download";
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

  const remainingVo = `${t("Remaining", { ns: "common" })} ${timeFormat(
    timeRemaining(totalLength, completedLength, downloadSpeed),
  )}`;

  const progress = (completedLength / totalLength) * 100 || 0;

  return (
    <div>
      <ListItem
        sx={({ palette }) => ({ bgcolor: palette.background.paper })}
        secondaryAction={
          <Box
            sx={{
              "& .MuiBox-root": { justifyContent: "end", textAlign: "end" },
            }}
          >
            <TaskItemAction
              onResume={onResume}
              onStop={onStop}
              gid={task.gid}
              status={status}
              onCopyLink={onCopyLink}
              onOpenFile={onOpenFile}
              onPause={onPause}
            />
            <TaskDownloadDes
              speed={speedVo}
              connections={connections}
              remaining={remainingVo}
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

      {progress > 0 && progress < 100 && (
        <LinearProgress variant="determinate" value={progress} />
      )}
    </div>
  );
}

export default TaskItem;
