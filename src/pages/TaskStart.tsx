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

function TaskActivePage() {
  const { t } = useTranslation();

  const { tasks, fetchTasks } = useTaskStore();

  useMount(() => {
    fetchTasks();
  });

  return (
    <BasePage
      title={t("Task-Start")}
      header={
        <Box>
          <IconButton size="small" title={t("Close All Tasks")}>
            <CloseOutlined />
          </IconButton>

          <IconButton size="small">
            <RefreshOutlined />
          </IconButton>

          <IconButton size="small">
            <PlayArrowOutlined />
          </IconButton>

          <IconButton size="small" onClick={() => {}}>
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
        <TaskItem />
        <TaskItem />
        {tasks.map((task) => (
          <TaskItem key={task.gid} />
        ))}
      </List>
    </BasePage>
  );
}

export default TaskActivePage;
