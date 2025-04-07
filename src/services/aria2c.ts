import axios, { AxiosInstance } from "axios";

import { getAria2Info } from "@/services/cmd";

let instancePromise: Promise<{
  axiosIns: AxiosInstance;
  webSocketIns: WebSocket;
  eventSubscribeMap: typeof eventSubscribeMap;
}> = null!;

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

async function getInstancePromise() {
  console.log("aria2", "Initializing instances");

  let server = "";
  const aria2Info = await getAria2Info();

  if (aria2Info.server) {
    server = aria2Info.server;
  } else {
    throw new Error("Server URL is invalid or not retrieved");
  }

  const axiosIns = axios.create({
    baseURL: `http://${server}`,
    timeout: 15000,
  });

  const webSocketIns = new WebSocket(`ws://${server}/jsonrpc`);

  webSocketIns.onopen = () => {
    console.log("aria2", "WebSocket OPEN");
  };

  webSocketIns.onclose = () => {
    console.log("aria2", "WebSocket CLOSE");
  };

  webSocketIns.onmessage = (message: MessageEvent) => {
    const data = JSON.parse(message.data);
    const key = data?.method;

    if (!data.id && key in eventSubscribeMap) {
      const callbacks = eventSubscribeMap[key];
      callbacks?.forEach((fn) => fn(data.params));
    }
  };

  webSocketIns.onerror = (error) => {
    console.error("aria2", "WebSocket ERROR", error);
  };

  return { axiosIns, webSocketIns, eventSubscribeMap };
}

async function getInstance(force = false) {
  if (!instancePromise || force) {
    instancePromise = getInstancePromise();
  }
  return instancePromise;
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
