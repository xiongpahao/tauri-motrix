import { create } from "zustand";

export type TaskLevel = "all" | "start" | "waiting" | "stopped";

interface TaskStore {
  tasks: Record<TaskLevel, any[]>;
}

const useTaskStore = create<TaskStore>((set) => ({
  tasks: {
    all: [],
    start: [],
    waiting: [],
    stopped: [],
  },
}));

export function useTask(taskLevel: TaskLevel) {
  const { tasks } = useTaskStore();

  return tasks[taskLevel];
}
