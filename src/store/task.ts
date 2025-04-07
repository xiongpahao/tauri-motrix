import { create } from "zustand";

import { Aria2Task, downloadingTasksApi } from "@/services/aria2c_api";

export type TaskLevel = "all" | "start" | "waiting" | "stopped";

interface TaskStore {
  tasks: Array<Aria2Task>;
  fetchTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  async fetchTasks() {
    const tasks = await downloadingTasksApi();
    set({ tasks });
  },
}));
