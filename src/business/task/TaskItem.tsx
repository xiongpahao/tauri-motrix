import {
  Box,
  Checkbox,
  LinearProgress,
  LinearProgressProps,
  ListItem,
  ListItemIcon,
  ListItemText,
  typographyClasses,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import TaskItemAction from "@/business/task/TaskItemAction";
import TaskItemDrawer from "@/business/task/TaskItemDrawer";
import { TaskDownloadDes } from "@/client/task_compose";
import { TASK_STATUS_ENUM } from "@/constant/task";
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

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [openInfo, setOpenInfo] = useState(false);

  const progressColor = useMemo((): LinearProgressProps["color"] => {
    if (progress === 100) {
      return "success";
    }

    if (status === TASK_STATUS_ENUM.Pause) {
      return "secondary";
    }

    return "primary";
  }, [progress, status]);

  const progressText = useMemo(() => {
    if (isSm) {
      const rate = completedLength / totalLength;
      return `${+rate.toFixed(2) * 100}%`;
    }

    const completed = parseByteVo(completedLength).join("");
    const total = parseByteVo(totalLength).join("");

    return `${completed} / ${total}`;
  }, [completedLength, isSm, totalLength]);

  return (
    <div>
      <ListItem sx={({ palette }) => ({ bgcolor: palette.background.paper })}>
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
          sx={{
            display: "table",
            tableLayout: "fixed",
            width: "100%",
            [`& .${typographyClasses.body1}`]: {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            },
          }}
          primary={getTaskName(task)}
          secondary={progressText}
        />

        <Box
          sx={{
            "& > :first-of-type": { textAlign: "end", textWrap: "nowrap" },
            "& > :last-child": {
              paddingRight: "5px",
              justifyContent: "end",
              textWrap: "nowrap",
            },
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
            onShowInfo={() => setOpenInfo(true)}
          />
          {status === TASK_STATUS_ENUM.Active && (
            <TaskDownloadDes
              speed={speedVo}
              connections={connections}
              remaining={remainingVo}
            />
          )}
        </Box>
      </ListItem>

      <LinearProgress
        variant="determinate"
        color={progressColor}
        value={progress}
      />

      <TaskItemDrawer
        open={openInfo}
        task={task}
        onClose={() => setOpenInfo(false)}
      />
    </div>
  );
}

export default TaskItem;
