import { create } from "zustand";

export type TaskLevel = "all" | "start" | "waiting" | "stopped";

// TODO
export type Task = object;

interface TaskStore {
  tasks: Array<Task>;
}

export const useTaskStore = create<TaskStore>(() => ({
  tasks: [],
}));
