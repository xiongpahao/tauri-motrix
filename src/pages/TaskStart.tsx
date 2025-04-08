import {
  CloseOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import { Box, IconButton, List } from "@mui/material";
import { useMount } from "ahooks";
import { useTranslation } from "react-i18next";

import TaskItem from "@/business/task/TaskItem";
import BasePage from "@/components/BasePage";
import { useTaskStore } from "@/store/task";

function TaskStartPage() {
  const { t } = useTranslation();

  const { tasks, fetchTasks, selectedTaskIds, handleTaskSelect } =
    useTaskStore();

  const noneSelected = selectedTaskIds.length === 0;

  useMount(() => {
    fetchTasks();
    console.log("fetch-tasks");
  });

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
    >
      <List
        disablePadding
        sx={{
          "& > :not(:last-child)": {
            "margin-block-end": 16,
          },
        }}
      >
        {tasks.map((task) => (
          <TaskItem
            key={task.gid}
            task={task}
            onSelect={handleTaskSelect}
            selected={selectedTaskIds.includes(task.gid)}
          />
        ))}
      </List>
    </BasePage>
  );
}

export default TaskStartPage;
