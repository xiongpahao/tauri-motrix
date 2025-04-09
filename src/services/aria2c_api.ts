import { aria2cCall, aria2cMultiCall } from "@/services/aria2c";

export interface Aria2BitTorrent {
  info: {
    name: string;
  };
  announceList: string[];
}

export interface Aria2Task {
  infoHash?: unknown;
  bittorrent?: Aria2BitTorrent;
  bitfield: string;
  completedLength: string;
  connections: string;
  dir: string;
  downloadSpeed: string;
  files: Aria2File[];
  gid: string;
  numPieces: string;
  pieceLength: string;
  status: string;
  totalLength: string;
  uploadLength: string;
  uploadSpeed: string;
}

export interface Aria2File {
  completedLength: string;
  index: string;
  length: string;
  path: string;
  selected: string;
  uris: Array<{
    status: string;
    uri: string;
  }>;
}

export const downloadingTasksApi = (param?: {
  offset?: number;
  num?: number;
}) =>
  aria2cMultiCall<[[Aria2Task[]], [Aria2Task[]]]>([
    {
      method: "tellActive",
      params: [],
    },
    {
      method: "tellWaiting",
      params: [param?.offset ?? 0, param?.num ?? 20],
    },
  ]);

export const addTaskApi = (urls: string | string[]) =>
  aria2cCall<string>("addUri", typeof urls === "string" ? [urls] : urls);

export interface Aria2GlobalStat {
  downloadSpeed: string;
  numActive: string;
  numWaiting: string;
  numStopped: string;
  uploadSpeed: string;
}

export const getGlobalStatApi = () =>
  aria2cCall<Aria2GlobalStat>("getGlobalStat");

export const pauseTaskApi = (gid: string) => aria2cCall("pause", gid);
export const pauseAllTaskApi = () => aria2cCall("pauseAll");
export const batchPauseTaskApi = (gids: string[]) =>
  aria2cMultiCall(gids.map((gid) => ({ method: "pause", params: [gid] })));

export const resumeTaskApi = (gid: string) => aria2cCall("unpause", gid);
export const resumeAllTaskApi = () => aria2cCall("unpauseAll");
export const batchResumeTaskApi = (gids: string[]) =>
  aria2cMultiCall(gids.map((gid) => ({ method: "unpause", params: [gid] })));

export const removeTaskApi = (gid: string) => aria2cCall("remove", gid);
