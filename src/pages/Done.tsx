import { useMount } from "ahooks";
import { useTranslation } from "react-i18next";

import TaskAllAction from "@/business/task/TaskAllAction";
import TaskItem from "@/business/task/TaskItem";
import { TaskList } from "@/client/task_compose";
import BasePage from "@/components/BasePage";
import { TASK_STATUS_ENUM } from "@/constant/task";
import { useTaskStore } from "@/store/task";

function DonePage() {
  const { t } = useTranslation();

  const {
    setFetchType,
    tasks,
    selectedTaskIds,
    handleTaskPause,
    handleTaskResume,
    handleTaskSelect,
    handleTaskStop,
    copyTaskLink,
    fetchType,
    openTaskFile,
  } = useTaskStore();

  useMount(() => {
    setFetchType(TASK_STATUS_ENUM.Done);
  });

  return (
    <BasePage
      title={t("Task-Done")}
      header={
        <TaskAllAction
          onPause={handleTaskPause}
          onResume={handleTaskResume}
          selectedTaskIds={selectedTaskIds}
          fetchType={fetchType}
          onStop={handleTaskStop}
        />
      }
    >
      <TaskList
        dataSource={tasks}
        renderItem={(task) => (
          <TaskItem
            key={task.gid}
            task={task}
            onSelect={handleTaskSelect}
            onPause={handleTaskPause}
            onStop={handleTaskStop}
            onResume={handleTaskResume}
            onOpenFile={openTaskFile}
            onCopyLink={copyTaskLink}
            selected={selectedTaskIds.includes(task.gid)}
          />
        )}
      />
    </BasePage>
  );
}

export default DonePage;
