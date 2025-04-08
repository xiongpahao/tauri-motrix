import axios, { AxiosInstance } from "axios";

import { getAria2Info } from "@/services/cmd";
import { ensurePrefix } from "@/utils/aria2c";

const DEFAULT_TIMEOUT = 15000;

let instancePromise: Promise<{
  axiosIns: AxiosInstance;
  webSocketIns: WebSocket;
  eventSubscribeMap: typeof eventSubscribeMap;
}> = null!;

const eventSubscribeMap: Record<
  string,
  Array<(data: MessageEvent["data"]) => void> | undefined
> = {};

const socketPendingMap: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { resolve: (data: any) => void; reject: (data: unknown) => void }
> = {};

type MultiCall = Array<{
  method: string;
  params: CallParam;
}>;
export type CallParam = string | boolean | number | object | CallParam[];

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
    baseURL: `http://${server}/jsonrpc`,
    timeout: DEFAULT_TIMEOUT,
  });

  axiosIns.interceptors.response.use(({ data }) => {
    if (data?.error) {
      return Promise.reject(data.error);
    }
    return data.result;
  });

  const webSocketIns = new WebSocket(`ws://${server}/jsonrpc`);

  webSocketIns.onopen = () => {
    console.log("aria2", "WebSocket OPEN");
  };

  webSocketIns.onclose = () => {
    console.log("aria2", "WebSocket CLOSE");
  };

  const messageHandle = (data: MessageEvent["data"]) => {
    const { method: key, id: messageId } = data;

    if (!messageId && key in eventSubscribeMap) {
      const callbacks = eventSubscribeMap[key];
      callbacks?.forEach((fn) => fn(data.params));
    }

    if (!key && messageId in socketPendingMap) {
      const pending = socketPendingMap[messageId];
      delete socketPendingMap[messageId];
      if (data.error) {
        pending.reject(data.error);
      } else {
        pending.resolve(data.result);
      }
    }
  };

  webSocketIns.onmessage = (message: MessageEvent) => {
    let data;
    try {
      data = JSON.parse(message.data);
    } catch (err) {
      eventSubscribeMap.error?.forEach((fn) => fn(err));
      console.error("aria2", "WebSocket ERROR", message, err);
      return;
    }

    if (Array.isArray(data)) {
      data.forEach(messageHandle);
    } else {
      messageHandle(data);
    }
  };

  webSocketIns.onerror = (error) => {
    console.error("aria2", "WebSocket ERROR", error);
    eventSubscribeMap.error?.forEach((fn) => fn(error));
  };

  return { axiosIns, webSocketIns, eventSubscribeMap };
}

export function getAria2Instance(force = false) {
  if (!instancePromise || force) {
    instancePromise?.then(({ webSocketIns }) => webSocketIns.close());

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

  const { axiosIns, webSocketIns } = await getAria2Instance();

  if (webSocketIns.readyState === WebSocket.OPEN) {
    return new Promise<T>((resolve, reject) => {
      socketPendingMap[message.id] = {
        resolve,
        reject,
      };
      webSocketIns.send(JSON.stringify(message));

      setTimeout(() => {
        reject(new Error("Request timed out."));
        delete socketPendingMap[message.id];
      }, DEFAULT_TIMEOUT);
    });
  }

  return axiosIns.post("", message);
}

export function aria2cMultiCall<T>(calls: MultiCall) {
  const multi = [
    calls.map(({ method, params }) => {
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
  const { eventSubscribeMap } = await getAria2Instance();
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
  const { eventSubscribeMap } = await getAria2Instance();
  const key = ensurePrefix(method);
  eventSubscribeMap[key] = [callback];
}

export async function aria2cRemoveListener<T>(
  method: string,
  callback: (data: T) => void,
) {
  const { eventSubscribeMap } = await getAria2Instance();
  const key = ensurePrefix(method);
  const callbacks = eventSubscribeMap[key];
  eventSubscribeMap[key] = callbacks?.filter((fn) => fn !== callback);
}

export async function aria2cRemoveAllListener(method: string) {
  const { eventSubscribeMap } = await getAria2Instance();
  const key = ensurePrefix(method);
  eventSubscribeMap[key] = [];
}

aria2cCall<string[]>("system.listNotifications").then((res) =>
  console.log("aria2 notifications: ", res),
);

aria2cCall<string[]>("system.listMethods").then((res) =>
  console.log("aria2 methods: ", res),
);
