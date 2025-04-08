import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { create } from "zustand";

import {
  addTaskApi,
  Aria2Task,
  downloadingTasksApi,
  pauseTaskApi,
  resumeTaskApi,
  stopTaskApi,
} from "@/services/aria2c_api";
import { getTaskFullPath, getTaskUri } from "@/utils/task";

interface TaskStore {
  tasks: Array<Aria2Task>;
  selectedTaskIds: Array<string>;
  fetchTasks: () => void;
  handleTaskSelect: (taskId: string) => void;
  handleTaskPause: (taskId: string) => void;
  handleTaskResume: (taskId: string) => void;
  handleTaskStop: (taskId: string) => void;
  openTaskFile: (task: Aria2Task) => void;
  copyTaskLink: (task: Aria2Task) => void;
  addTask: (url: string) => void;
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
    await stopTaskApi(taskId);
    await get().fetchTasks();
  },
  async openTaskFile(task) {
    const path = await getTaskFullPath(task);
    await revealItemInDir(path);
  },
  async copyTaskLink(task) {
    const link = await getTaskUri(task);
    await writeText(link);
  },
}));

setInterval(() => {
  useTaskStore.getState().fetchTasks();
}, 1000);
