import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { confirm } from "@tauri-apps/plugin-dialog";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { t } from "i18next";
import { create } from "zustand";

import { TASK_STATUS_ENUM } from "@/constant/task";
import {
  addTaskApi,
  Aria2GlobalStat,
  Aria2Task,
  downloadingTasksApi,
  getAria2,
  pauseTaskApi,
  removeTaskApi,
  resumeTaskApi,
  stoppedTasksApi,
  waitingTasksApi,
} from "@/services/aria2c_api";
import { getTaskFullPath, getTaskName, getTaskUri } from "@/utils/task";

import { DownloadOption } from "./../services/aria2c_api";

const DEFAULT_INTERVAL = 1000;
const MAX_INTERVAL = 6000;
const MIN_INTERVAL = 500;

interface TaskStore {
  tasks: Array<Aria2Task>;
  fetchType: TASK_STATUS_ENUM;
  selectedTaskIds: Array<string>;
  timer?: number;
  interval: number;
  fetchTasks: () => void;
  setFetchType: (type: TASK_STATUS_ENUM) => void;
  handleTaskSelect: (taskId: string) => void;
  handleTaskPause: (taskId: string) => void;
  handleTaskResume: (taskId: string) => void;
  handleTaskStop: (taskId: string) => void;
  openTaskFile: (taskId: string) => void;
  copyTaskLink: (taskId: string) => void;
  addTask: (url: string, option: DownloadOption) => void;
  getTaskByGid: (gid: string) => Aria2Task;
  registerEvent: () => void;
  polling: () => void;
  updateInterval: (stat?: Aria2GlobalStat) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTaskIds: [],
  timer: undefined,
  interval: DEFAULT_INTERVAL,
  fetchType: TASK_STATUS_ENUM.Active,
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

      case TASK_STATUS_ENUM.Stopped:
        tasks = await stoppedTasksApi();
        break;
    }

    set({ tasks });
  },

  async addTask(url, option) {
    const optionDto: typeof option = {};
    if (option.dir) {
      optionDto.dir = option.dir;
    }
    if (option.out) {
      optionDto.out = option.out;
    }
    if (option.split) {
      optionDto.split = option.split;
    }

    await addTaskApi(url, optionDto);
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
  async registerEvent() {
    const { addListener } = await getAria2();

    addListener("onDownloadStart", (gid) => {
      console.log("onDownloadStart", gid);
    });

    addListener("onDownloadStop", (gid) => {
      console.log("onDownloadStop", gid);
    });

    addListener("onDownloadComplete", (gid) => {
      console.log("onDownloadComplete", gid);
    });

    addListener("onDownloadError", (gid) => {
      console.log("onDownloadError", gid);
    });

    addListener("onBtDownloadComplete", (gid) => {
      console.log("onBtDownloadComplete", gid);
    });
  },
  polling() {
    const { interval, polling, fetchTasks } = get();
    const timer = setTimeout(() => {
      fetchTasks();
      polling();
    }, interval);
    set({ timer });
  },
  updateInterval(stat?: Aria2GlobalStat) {
    const { interval: currentInterval } = get();
    const numActive =
      stat?.numActive && !isNaN(Number(stat.numActive))
        ? Number(stat.numActive)
        : 0;

    let interval: number;
    if (numActive > 0) {
      const newInterval = DEFAULT_INTERVAL - 100 * numActive;
      interval = Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, newInterval));
    } else {
      const newInterval = Math.max(MIN_INTERVAL, currentInterval + 100);
      interval = newInterval;
    }
    set({ interval });
  },
}));

setTimeout(() => {
  useTaskStore.getState().polling();
}, 100);
