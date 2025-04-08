import { create } from "zustand";

import {
  addTaskApi,
  Aria2Task,
  downloadingTasksApi,
} from "@/services/aria2c_api";

export type TaskLevel = "all" | "start" | "waiting" | "stopped";

interface TaskStore {
  tasks: Array<Aria2Task>;
  selectedTaskIds: Array<string>;
  fetchTasks: () => void;
  handleTaskSelect: (taskId: string) => void;
  addTask: (url: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTaskIds: [],
  async fetchTasks() {
    const tasks = await downloadingTasksApi();
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
}));

setInterval(() => {
  useTaskStore.getState().fetchTasks();
}, 1000);
