import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { confirm } from "@tauri-apps/plugin-dialog";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { t } from "i18next";
import { create } from "zustand";

import {
  addTaskApi,
  Aria2Task,
  downloadingTasksApi,
  pauseTaskApi,
  removeTaskApi,
  resumeTaskApi,
} from "@/services/aria2c_api";
import { getTaskFullPath, getTaskName, getTaskUri } from "@/utils/task";

interface TaskStore {
  tasks: Array<Aria2Task>;
  selectedTaskIds: Array<string>;
  fetchTasks: () => void;
  handleTaskSelect: (taskId: string) => void;
  handleTaskPause: (taskId: string) => void;
  handleTaskResume: (taskId: string) => void;
  handleTaskStop: (taskId: string) => void;
  openTaskFile: (taskId: string) => void;
  copyTaskLink: (taskId: string) => void;
  addTask: (url: string) => void;
  getTaskByGid: (gid: string) => Aria2Task;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTaskIds: [],
  async fetchTasks() {
    const tasks = await downloadingTasksApi().then((res) => res?.flat(2));

    set({ tasks });
  },

  async addTask(url) {
    await addTaskApi(url);
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
  async handleTaskPause(taskId: string) {
    await pauseTaskApi(taskId);
    await get().fetchTasks();
  },
  async handleTaskResume(taskId) {
    await resumeTaskApi(taskId);
    await get().fetchTasks();
  },
  async handleTaskStop(taskId) {
    const task = get().getTaskByGid(taskId);
    const taskName = getTaskName(task);

    const result = await confirm(t("task.ConfirmDelete", { taskName }), {
      title: t("task.Delete"),
      kind: "warning",
    });

    if (!result) {
      return;
    }

    await removeTaskApi(taskId);
    await get().fetchTasks();
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
}));

setInterval(() => {
  useTaskStore.getState().fetchTasks();
}, 1000);
