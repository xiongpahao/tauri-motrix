import { FolderOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  listItemClasses,
  ModalProps,
  styled,
  Typography,
} from "@mui/material";
import { openPath } from "@tauri-apps/plugin-opener";
import { useTranslation } from "react-i18next";

import { TaskDrawerItem, TaskDrawerList } from "@/client/task_compose";
import LinearProgressWithLabel from "@/components/LinearProgressWithLabel";
import { Aria2Task } from "@/services/aria2c_api";
import { parseByteVo } from "@/utils/download";
import { getTaskName } from "@/utils/task";

export interface TaskItemDrawerProps {
  open: boolean;
  onClose: ModalProps["onClose"];
  task: Aria2Task;
}

const TheContainer = styled(Box)(() => ({
  width: "400px",
  height: "100%",
  padding: "16px",
  backgroundColor: "#f5f5f5",
  [`.${listItemClasses.root}`]: {
    padding: "8px 0",
  },
  overflow: "auto",
}));

function TaskItemDrawer({ open, onClose, task }: TaskItemDrawerProps) {
  const { t } = useTranslation();
  const taskName = getTaskName(task);

  const totalLength = Number(task.totalLength) || 0;
  const completedLength = Number(task.completedLength) || 0;
  const progress = (completedLength / totalLength) * 100 || 0;

  const speedVo = parseByteVo(task.downloadSpeed, "/s").join("");

  const completed = parseByteVo(completedLength).join("");
  const total = parseByteVo(totalLength).join("");
  const progressText = `${completed} / ${total}`;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <TheContainer role="presentation">
        <Typography
          variant="h6"
          sx={{ marginBottom: "16px", color: "#333", fontWeight: "700" }}
        >
          {t("task.Details")}
        </Typography>
        <TaskDrawerList title={t("task.InfoDetails")}>
          <TaskDrawerItem label="GID" value={task.gid} />
          <Divider />
          <TaskDrawerItem label="Task Name" value={taskName} />
          <Divider />
          <TaskDrawerItem
            action={
              <IconButton
                title={t("task.OpenFile")}
                onClick={() => openPath(task.dir)}
              >
                <FolderOutlined />
              </IconButton>
            }
            label="Save to"
            value={task.dir}
          />
          <Divider />
          <TaskDrawerItem label="Status" value={task.status} />
        </TaskDrawerList>

        <TaskDrawerList title={t("task.SpeedDetails")}>
          <LinearProgressWithLabel value={progress} />
          <TaskDrawerItem label="Progress" value={progressText} />
          <TaskDrawerItem label="Connections" value={task.connections} />
          <TaskDrawerItem label="Download Speed" value={speedVo} />
        </TaskDrawerList>
      </TheContainer>
    </Drawer>
  );
}

export default TaskItemDrawer;
