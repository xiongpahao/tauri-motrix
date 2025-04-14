import {
  CloseOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import { TaskActionButton } from "@/client/task_compose";
import { TASK_STATUS_ENUM } from "@/constant/task";

interface TaskAllActionProps {
  selectedTaskIds: string[];
  fetchType: TASK_STATUS_ENUM;
  onPause: (taskId?: string) => void;
  onResume: (taskId?: string) => void;
}

function TaskAllAction({
  selectedTaskIds,
  fetchType,
  onPause,
  onResume,
}: TaskAllActionProps) {
  const { t } = useTranslation("task");

  const noneSelected = selectedTaskIds.length === 0;

  return (
    <Box>
      <TaskActionButton
        title={t("task.CloseAll")}
        disabled={noneSelected}
        icon={<CloseOutlined />}
      />

      <TaskActionButton
        disabled={noneSelected}
        title={t("task.RefreshAll")}
        icon={<RefreshOutlined />}
      />

      {fetchType === TASK_STATUS_ENUM.Active && (
        <>
          <TaskActionButton
            disabled={noneSelected}
            title={t("task.ResumeAll")}
            icon={<PlayArrowOutlined />}
            onClick={() => onResume()}
          />

          <TaskActionButton
            title={t("task.PauseAll")}
            disabled={noneSelected}
            icon={<PauseOutlined />}
            onClick={() => onPause()}
          />
        </>
      )}
    </Box>
  );
}

export default TaskAllAction;
