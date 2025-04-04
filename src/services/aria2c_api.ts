import axios, { AxiosInstance } from "axios";

import { getAria2Info } from "@/services/cmd";

let axiosIns: AxiosInstance = null!;

type MultiCall = [string, ...CallParam[]];
type CallParam = string | boolean | number | object | CallParam[];

function ensurePrefix(str: string) {
  if (!str.startsWith("system.") && !str.startsWith("aria2.")) {
    str = "aria2." + str;
  }
  return str;
}

// function ensureNotPrefix(str: string) {
//   const suffix = str.split("aria2.")[1];
//   return suffix || str;
// }

export async function getAxios(force: boolean = false) {
  if (axiosIns && !force) {
    return axiosIns;
  }

  let server = "";

  const aria2Info = await getAria2Info().catch();

  if (aria2Info.server) {
    server = aria2Info.server;
  }

  axiosIns = axios.create({
    baseURL: `http://${server}`,
    timeout: 15000,
  });

  return axiosIns;
}

export async function aria2cCall<T>(
  method: string,
  ...params: CallParam[]
): Promise<T> {
  const message = {
    jsonrpc: "2.0",
    id: Date.now().toString(),
    method: ensurePrefix(method),
    params,
  };

  const instance = await getAxios();

  const { data } = await instance.post("/jsonrpc", message);

  if (data.error) {
    throw data.error;
  }

  return data.result;
}

aria2cCall<string[]>("system.listNotifications").then((res) =>
  console.log("aria2 notifications: ", res),
);

aria2cCall<string[]>("system.listMethods").then((res) =>
  console.log("aria2 methods: ", res),
);

export function aria2cMultiCall<T>(calls: MultiCall[]) {
  const multi = [
    calls.map(([method, ...params]) => {
      return {
        methodName: ensurePrefix(method),
        params: params,
      };
    }),
  ];
  return aria2cCall<T>("system.multicall", ...multi);
}

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

export const downloadingTasks = (param?: {
  offset?: number;
  num?: number;
  keys?: unknown;
}) =>
  aria2cMultiCall<[Aria2Task[], Aria2Task[]]>([
    ["aria2.tellActive", ...[param?.keys ?? []]],
    ["aria2.tellWaiting", ...[param?.offset ?? 0, param?.num ?? 20]],
  ]).then((res) => res.flat(2));

export const stoppedTasks = (args: object[]) =>
  aria2cCall<Aria2Task[]>("tellStopped", ...args);
