import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { confirm } from "@tauri-apps/plugin-dialog";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { t } from "i18next";
import { create } from "zustand";

import { Notice } from "@/components/Notice";
import { TASK_STATUS_ENUM } from "@/constant/task";
import {
  addTaskApi,
  Aria2Task,
  batchPauseTaskApi,
  batchRemoveTaskApi,
  batchResumeTaskApi,
  downloadingTasksApi,
  getAria2,
  pauseTaskApi,
  removeTaskApi,
  resumeTaskApi,
  stoppedTasksApi,
  taskItemApi,
  waitingTasksApi,
} from "@/services/aria2c_api";
import { DownloadOption } from "@/services/aria2c_api";
import { usePollingStore } from "@/store/polling";
import { compactUndefined } from "@/utils/compact_undefined";
import { getTaskFullPath, getTaskName, getTaskUri } from "@/utils/task";

export type WrapGid = [{ gid: string }];

interface TaskStore {
  tasks: Array<Aria2Task>;
  fetchType: TASK_STATUS_ENUM;
  selectedTaskIds: Array<string>;
  selectedTasks: Array<Aria2Task>;
  fetchTasks: () => void;
  setFetchType: (type: TASK_STATUS_ENUM) => void;
  handleTaskSelect: (taskId: string) => void;
  handleTaskPause: (taskId?: string) => void;
  handleTaskResume: (taskId?: string) => void;
  handleTaskDelete: (taskId?: string) => void;
  openTaskFile: (taskId: string) => void;
  copyTaskLink: (taskId: string) => void;
  addTask: (url: string, option: DownloadOption) => void;
  getTaskByGid: (gid: string) => Aria2Task;
  registerEvent: () => void;
  onDownloadStart: (wrap: WrapGid) => void;
  onDownloadStop: (wrap: WrapGid) => void;
  onDownloadComplete: (wrap: WrapGid) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTaskIds: [],
  fetchType: TASK_STATUS_ENUM.Active,
  get selectedTasks() {
    const { tasks, selectedTaskIds } = get();
    return tasks.filter((task) => selectedTaskIds.includes(task.gid));
  },
  async fetchTasks() {
    const { fetchType } = get();

    let tasks;
    switch (fetchType) {
      case TASK_STATUS_ENUM.Active:
        tasks = await downloadingTasksApi().then((res) => res?.flat(2));
        break;

      case TASK_STATUS_ENUM.Waiting:
        tasks = await waitingTasksApi();
        break;

      case TASK_STATUS_ENUM.Done:
        tasks = await stoppedTasksApi();
        break;
    }

    set({ tasks });
  },
  async addTask(url, option) {
    await addTaskApi(url, compactUndefined(option));
    await get().fetchTasks();
  },
  handleTaskSelect(taskId: string) {
    const { selectedTaskIds } = get();

    const idsSet = new Set(selectedTaskIds);

    if (idsSet.has(taskId)) {
      idsSet.delete(taskId);
    } else {
      idsSet.add(taskId);
    }

    set({ selectedTaskIds: Array.from(idsSet) });
  },
  async setFetchType(type: TASK_STATUS_ENUM) {
    set({ fetchType: type, selectedTaskIds: [] });
    await get().fetchTasks();
  },
  async handleTaskPause(taskId?: string) {
    if (taskId) {
      await pauseTaskApi(taskId);
    } else {
      const { selectedTaskIds } = get();
      await batchPauseTaskApi(selectedTaskIds);
    }
    await get().fetchTasks();
  },
  async handleTaskResume(taskId) {
    if (taskId) {
      await resumeTaskApi(taskId);
    } else {
      const { selectedTaskIds } = get();
      await batchResumeTaskApi(selectedTaskIds);
    }
    await get().fetchTasks();
  },
  async handleTaskDelete(taskId) {
    const { getTaskByGid, selectedTaskIds, fetchTasks } = get();

    let result: boolean;
    if (!taskId) {
      result = await confirm(
        t("task.ConfirmDeleteBatch", {
          tasksLength: selectedTaskIds.length,
          title: t("task.Delete"),
          kind: "warning",
        }),
      );
    } else {
      const task = getTaskByGid(taskId);
      const taskName = getTaskName(task, "unknown", 16);

      result = await confirm(t("task.ConfirmDelete", { taskName }), {
        title: t("task.Delete"),
        kind: "warning",
      });
    }

    if (!result) {
      return;
    }

    if (!taskId) {
      await batchRemoveTaskApi(selectedTaskIds);
      set({ selectedTaskIds: [] });
    } else {
      await removeTaskApi(taskId);
    }

    await fetchTasks();
  },
  async openTaskFile(taskId) {
    const task = get().getTaskByGid(taskId);
    const path = await getTaskFullPath(task);
    await revealItemInDir(path);
  },
  async copyTaskLink(taskId) {
    const task = get().getTaskByGid(taskId);
    const link = await getTaskUri(task);
    await writeText(link);
  },
  getTaskByGid(gid) {
    const { tasks } = get();
    const task = tasks.find((task) => task.gid === gid);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  },
  async onDownloadStart([{ gid }]) {
    get().fetchTasks();
    usePollingStore.getState().resetInterval();

    const task = await taskItemApi({ gid });
    const taskName = getTaskName(task, "unknown", 16);
    Notice.success(t("task.StartMessage", { taskName }));
  },
  async onDownloadStop([{ gid }]) {
    const task = await taskItemApi({ gid });
    const taskName = getTaskName(task, "unknown", 16);
    Notice.success(t("task.StopMessage", { taskName }));
  },
  async onDownloadComplete([{ gid }]) {
    get().fetchTasks();
    const task = await taskItemApi({ gid });
    const title = getTaskName(task, "unknown", 16);

    sendNotification({ title, body: t("common.Complete") });
  },
  async registerEvent() {
    const { onDownloadComplete, onDownloadStart, onDownloadStop } = get();
    const { addListener } = await getAria2();

    addListener("onDownloadStart", onDownloadStart);
    addListener("onDownloadStop", onDownloadStop);
    addListener("onDownloadComplete", onDownloadComplete);
  },
}));
