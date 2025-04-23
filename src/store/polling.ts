import { create } from "zustand";

import { Aria2GlobalStat } from "@/services/aria2c_api";
import { useAria2StateStore } from "@/store/aria2_state";
import { useTaskStore } from "@/store/task";

export interface PollingStore {
  timer?: number;
  interval: number;
  polling: () => void;
  updateInterval: (stat?: Aria2GlobalStat) => void;
  resetInterval: () => void;
}

const DEFAULT_INTERVAL = 1000;
const MAX_INTERVAL = 6000;
const MIN_INTERVAL = 500;

export const usePollingStore = create<PollingStore>((set, get) => ({
  timer: undefined,
  interval: DEFAULT_INTERVAL,

  polling() {
    const { interval, polling, timer } = get();
    const { fetchTasks, registerEvent } = useTaskStore.getState();
    const { fetchGlobalStat } = useAria2StateStore.getState();
    if (!timer) {
      registerEvent();
    }
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      fetchTasks();
      fetchGlobalStat();
      polling();
    }, interval);
    set({ timer: newTimer });
  },
  updateInterval(stat) {
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
  resetInterval() {
    set({ interval: DEFAULT_INTERVAL });
  },
}));

setTimeout(() => {
  usePollingStore.getState().polling();
}, 100);
