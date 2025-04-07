import { aria2cCall, aria2cMultiCall } from "@/services/aria2c";

export interface Aria2Task {
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
  keys?: unknown;
}) =>
  aria2cMultiCall<[Aria2Task[], Aria2Task[]]>([
    ["aria2.tellActive", ...[param?.keys ?? []]],
    ["aria2.tellWaiting", ...[param?.offset ?? 0, param?.num ?? 20]],
  ]).then((res) => res.flat(2));

export const addTaskApi = (urls: string | string[]) => {
  if (typeof urls === "string") {
    urls = [urls];
  }
  return aria2cCall<string>("addUri", urls);
};

export interface Aria2GlobalStat {
  downloadSpeed: string;
  numActive: string;
  numWaiting: string;
  numStopped: string;
  uploadSpeed: string;
}

export const getGlobalStatApi = () =>
  aria2cCall<Aria2GlobalStat>("getGlobalStat");
