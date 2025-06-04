import { Box } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import TaskGraphic from "@/business/task/TaskGraphic";
import { TaskDrawerItem, TaskDrawerList } from "@/client/task_compose";
import LinearProgressWithLabel from "@/components/LinearProgressWithLabel";
import { Aria2Task } from "@/services/aria2c_api";
import { parseByteVo } from "@/utils/download";
import { getTaskProgressColor } from "@/utils/task";

export interface TaskSpeedPanelProps {
  task: Aria2Task;
}

function TaskSpeedPanel({ task }: TaskSpeedPanelProps) {
  const { status, bitfield } = task;
  const totalLength = Number(task.totalLength) || 0;
  const completedLength = Number(task.completedLength) || 0;
  const progress = (completedLength / totalLength) * 100 || 0;

  const completed = parseByteVo(completedLength).join("");
  const total = parseByteVo(totalLength).join("");
  const progressText = `${completed} / ${total}`;

  const speedVo = parseByteVo(task.downloadSpeed, "/s").join("");

  const { t } = useTranslation();

  const progressColor = useMemo(
    () => getTaskProgressColor(progress, status),
    [progress, status],
  );

  return (
    <TaskDrawerList>
      <TaskDrawerItem label={t("task.Progress")} value={progressText} />
      <TaskDrawerItem label={t("task.Connections")} value={task.connections} />
      <TaskDrawerItem label={t("task.DownloadSpeed")} value={speedVo} />

      <LinearProgressWithLabel value={progress} color={progressColor} />

      {bitfield && (
        <Box
          sx={(theme) => ({
            textAlign: "center",
            mt: 2,
            border:
              theme.palette.mode === "dark"
                ? "1px solid #565656"
                : "1px solid #ebeef5",
            borderRadius: 0.25,
            mb: 3,
            py: 1,
            px: 0.75,
          })}
        >
          <TaskGraphic bitfield={bitfield} outerWidth={400} />
        </Box>
      )}
    </TaskDrawerList>
  );
}

export default TaskSpeedPanel;
