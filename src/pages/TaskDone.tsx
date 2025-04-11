import { useMount } from "ahooks";
import { useTranslation } from "react-i18next";

import TaskItem from "@/business/task/TaskItem";
import { TaskList } from "@/client/task_compose";
import BasePage from "@/components/BasePage";
import { TASK_STATUS_ENUM } from "@/constant/task";
import { useTaskStore } from "@/store/task";

function TaskStoppedPage() {
  const { t } = useTranslation();

  const {
    setFetchType,
    tasks,
    selectedTaskIds,
    handleTaskPause,
    handleTaskResume,
    handleTaskSelect,
    handleTaskStop,
  } = useTaskStore();

  useMount(() => {
    setFetchType(TASK_STATUS_ENUM.Stopped);
  });

  return (
    <BasePage title={t("Task-Done")}>
      <TaskList
        dataSource={tasks}
        renderItem={(task) => (
          <TaskItem
            task={task}
            onSelect={handleTaskSelect}
            onPause={handleTaskPause}
            onStop={handleTaskStop}
            onResume={handleTaskResume}
            onOpenFile={() => {}}
            onCopyLink={() => {}}
            selected={selectedTaskIds.includes(task.gid)}
          />
        )}
      />
    </BasePage>
  );
}

export default TaskStoppedPage;
