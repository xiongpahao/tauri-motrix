import {
  CloseOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import { Box, IconButton, List } from "@mui/material";
import { useTranslation } from "react-i18next";

import TaskItem from "@/business/task/TaskItem";
import BasePage from "@/components/BasePage";

function TaskActivePage() {
  const { t } = useTranslation();

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
      </List>
    </BasePage>
  );
}

export default TaskActivePage;
