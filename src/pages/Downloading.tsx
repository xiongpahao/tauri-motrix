import { useMount } from "ahooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import AddTaskDialog from "@/business/task/AddTaskDialog";
import TaskAllAction from "@/business/task/TaskAllAction";
import TaskItem from "@/business/task/TaskItem";
import { TaskFab, TaskList } from "@/client/task_compose";
import BasePage from "@/components/BasePage";
import { TASK_STATUS_ENUM } from "@/constant/task";
import { useTaskStore } from "@/store/task";

function DownloadingPage() {
  const { t } = useTranslation();

  const {
    tasks,
    selectedTaskIds,
    fetchType,
    handleTaskSelect,
    handleTaskPause,
    handleTaskResume,
    handleTaskStop,
    openTaskFile,
    copyTaskLink,
    setFetchType,
  } = useTaskStore();

  const [addOpen, setAddOpen] = useState(false);

  useMount(() => {
    setFetchType(TASK_STATUS_ENUM.Active);
  });

  return (
    <BasePage
      title={t("Task-Start")}
      header={
        <TaskAllAction
          onPause={handleTaskPause}
          onResume={handleTaskResume}
          selectedTaskIds={selectedTaskIds}
          fetchType={fetchType}
        />
      }
      fab={<TaskFab onClick={() => setAddOpen(true)} />}
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

export default DownloadingPage;
