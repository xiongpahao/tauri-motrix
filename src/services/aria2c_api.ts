import axios, { AxiosInstance } from "axios";

import { getAria2Info } from "@/services/cmd";

let webSocketIns: WebSocket | null = null;
let axiosIns: AxiosInstance | null = null;

const eventSubscribeMap: Record<
  string,
  Array<(data: MessageEvent["data"]) => void> | undefined
> = {};

type MultiCall = [string, ...CallParam[]];
type CallParam = string | boolean | number | object | CallParam[];

function ensurePrefix(str: string) {
  if (!str.startsWith("system.") && !str.startsWith("aria2.")) {
    str = "aria2." + str;
  }
  return str;
}

async function getInstance(force = false) {
  if (axiosIns && webSocketIns && !force) {
    return { axiosIns, webSocketIns, eventSubscribeMap };
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

  webSocketIns = new WebSocket(`ws://${aria2Info.server}/jsonrpc`);

  webSocketIns.onopen = () => {
    console.log("aria2", "OPEN");
  };

  webSocketIns.onclose = () => {
    console.log("aria2", "CLOSE");
  };

  webSocketIns.onmessage = (message: MessageEvent) => {
    const data = JSON.parse(message.data);
    const key = data?.method;

    if (!data.id && key in eventSubscribeMap) {
      const callbacks = eventSubscribeMap[key];
      callbacks?.forEach((fn) => fn(data.params));
    }
  };

  return { axiosIns, webSocketIns, eventSubscribeMap };
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

  const { axiosIns } = await getInstance();
  const { data } = await axiosIns.post("/jsonrpc", message);

  if (data.error) {
    throw data.error;
  }

  return data.result;
}

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

export async function aria2cAddListener<T>(
  method: string,
  callback: (data: T) => void,
) {
  const { eventSubscribeMap } = await getInstance();
  const key = ensurePrefix(method);

  if (eventSubscribeMap[key]?.includes(callback)) {
    return;
  }

  eventSubscribeMap[key] ??= [];
  eventSubscribeMap[key].push(callback);
}

export async function aria2cSetListener<T>(
  method: string,
  callback: (data: T) => void,
) {
  const { eventSubscribeMap } = await getInstance();
  const key = ensurePrefix(method);
  eventSubscribeMap[key] = [callback];
}

export async function aria2cRemoveListener<T>(
  method: string,
  callback: (data: T) => void,
) {
  const { eventSubscribeMap } = await getInstance();
  const key = ensurePrefix(method);
  const callbacks = eventSubscribeMap[key];
  eventSubscribeMap[key] = callbacks?.filter((fn) => fn !== callback);
}

export async function aria2cRemoveAllListener(method: string) {
  const { eventSubscribeMap } = await getInstance();
  const key = ensurePrefix(method);
  eventSubscribeMap[key] = [];
}

aria2cCall<string[]>("system.listNotifications").then((res) =>
  console.log("aria2 notifications: ", res),
);

aria2cCall<string[]>("system.listMethods").then((res) =>
  console.log("aria2 methods: ", res),
);

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
