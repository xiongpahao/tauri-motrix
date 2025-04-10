import {
  AddOutlined,
  CloseOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import { Box, Fab, IconButton } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import AddTaskDialog from "@/business/task/AddTaskDialog";
import TaskItem from "@/business/task/TaskItem";
import { TaskList } from "@/client/task_compose";
import BasePage from "@/components/BasePage";
import { useTaskStore } from "@/store/task";

function TaskStartPage() {
  const { t } = useTranslation();

  const {
    tasks,
    selectedTaskIds,
    handleTaskSelect,
    handleTaskPause,
    handleTaskResume,
    handleTaskStop,
    openTaskFile,
    copyTaskLink,
  } = useTaskStore();

  const [addOpen, setAddOpen] = useState(false);

  const noneSelected = selectedTaskIds.length === 0;

  return (
    <BasePage
      title={t("Task-Start")}
      header={
        <Box>
          <IconButton
            size="small"
            title={t("task.CloseAll")}
            disabled={noneSelected}
          >
            <CloseOutlined />
          </IconButton>

          <IconButton
            size="small"
            disabled={noneSelected}
            title={t("task.RefreshAll")}
          >
            <RefreshOutlined />
          </IconButton>

          <IconButton
            size="small"
            disabled={noneSelected}
            title={t("task.ResumeAll")}
          >
            <PlayArrowOutlined />
          </IconButton>

          <IconButton
            size="small"
            title={t("task.PauseAll")}
            onClick={() => {}}
            disabled={noneSelected}
          >
            <PauseOutlined />
          </IconButton>
        </Box>
      }
      fab={
        <Fab
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          color="primary"
          onClick={() => setAddOpen(true)}
        >
          <AddOutlined />
        </Fab>
      }
    >
      <TaskList
        dataSource={tasks}
        renderItem={(task) => (
          <TaskItem
            onCopyLink={copyTaskLink}
            onStop={handleTaskStop}
            onResume={handleTaskResume}
            onPause={handleTaskPause}
            onOpenFile={openTaskFile}
            key={task.gid}
            task={task}
            onSelect={handleTaskSelect}
            selected={selectedTaskIds.includes(task.gid)}
          />
        )}
      />

      <AddTaskDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </BasePage>
  );
}

export default TaskStartPage;
