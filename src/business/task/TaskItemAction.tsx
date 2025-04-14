import {
  CloseOutlined,
  FileOpenOutlined,
  InfoOutlined,
  LinkOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TaskItemProps } from "@/business/task/TaskItem";
import { TaskActionButton } from "@/client/task_compose";
import { TASK_STATUS_ENUM } from "@/constant/task";

export interface TaskItemActionProps
  extends Pick<
    TaskItemProps,
    "onPause" | "onResume" | "onStop" | "onOpenFile" | "onCopyLink"
  > {
  status: string;
  gid: string;
}

function TaskItemAction({
  status,
  gid,
  onCopyLink,
  onOpenFile,
  onPause,
  onResume,
  onStop,
}: TaskItemActionProps) {
  const { t } = useTranslation("task");

  const statusActionElem = useMemo(() => {
    switch (status) {
      case TASK_STATUS_ENUM.Active:
        return (
          <TaskActionButton
            title={t("Pause")}
            icon={<PauseOutlined />}
            onClick={() => onPause(gid)}
          />
        );
      case TASK_STATUS_ENUM.Waiting:
        return (
          <TaskActionButton
            title={t("Resume")}
            icon={<PlayArrowOutlined />}
            onClick={() => onResume(gid)}
          />
        );
      case TASK_STATUS_ENUM.Done:
        return (
          <TaskActionButton title={t("Resume")} icon={<RefreshOutlined />} />
        );
    }
  }, [onPause, onResume, status, t, gid]);

  return (
    <Box>
      {statusActionElem}
      <TaskActionButton
        title={t("Close")}
        onClick={() => onStop(gid)}
        icon={<CloseOutlined />}
      />
      <TaskActionButton
        title={t("OpenFile")}
        icon={<FileOpenOutlined />}
        onClick={() => onOpenFile(gid)}
      />

      <TaskActionButton
        title={t("CopyLink")}
        icon={<LinkOutlined />}
        onClick={() => onCopyLink(gid)}
      />

      <TaskActionButton title={t("Info")} icon={<InfoOutlined />} />
    </Box>
  );
}

export default TaskItemAction;
