import {
  CallParam,
  createFetcherFactory,
  ensurePrefix,
  MultiCall,
} from "./util";

const DEFAULT_TIMEOUT = 15000;

export type EventSubscribeMap = Record<
  string,
  Array<(data: MessageEvent["data"]) => void> | undefined
>;

export interface Aria2InstanceConfig {
  server: string;
  eventSubscribeMap?: EventSubscribeMap;
}

export class Aria2 {
  eventSubscribeMap: Record<
    string,
    Array<(data: MessageEvent["data"]) => void> | undefined
  > = {};

  socketPendingMap: Record<
    string,
    {
      resolve: (data: MessageEvent["data"]) => void;
      reject: (data: unknown) => void;
    }
  > = {};

  webSocketIns: WebSocket;
  fetcher: ReturnType<typeof createFetcherFactory>;

  constructor(instanceConfig: Aria2InstanceConfig) {
    const { server, eventSubscribeMap } = instanceConfig;

    if (eventSubscribeMap) {
      this.eventSubscribeMap = eventSubscribeMap;
    }

    const webSocketIns = new WebSocket(`ws://${server}/jsonrpc`);
    this.webSocketIns = webSocketIns;
    this.fetcher = createFetcherFactory(server);

    webSocketIns.onopen = () => {
      console.log("aria2", "WebSocket OPEN");
    };

    webSocketIns.onclose = () => {
      console.log("aria2", "WebSocket CLOSE");
    };

    webSocketIns.onmessage = (message: MessageEvent) => {
      const { eventSubscribeMap, socketPendingMap } = this;

      const data = JSON.parse(message.data);
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

    webSocketIns.onerror = (error) => {
      const { eventSubscribeMap } = this;

      console.error("aria2", "WebSocket ERROR", error);
      eventSubscribeMap.error?.forEach((fn) => fn(error));
    };
  }

  call<T>(method: string, ...params: CallParam[]): Promise<T> {
    const message = {
      jsonrpc: "2.0",
      id: Date.now().toString(),
      method: ensurePrefix(method),
      params,
    };

    const { socketPendingMap, webSocketIns, fetcher } = this;

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

    return fetcher<T>(message);
  }

  multiCall<T>(calls: MultiCall) {
    const multi = [
      calls.map(({ method, params }) => {
        return {
          methodName: ensurePrefix(method),
          params: params,
        };
      }),
    ];
    return this.call<T>("system.multicall", ...multi);
  }

  addListener<T>(method: string, callback: (data: T) => void) {
    const { eventSubscribeMap } = this;
    const key = ensurePrefix(method);

    if (eventSubscribeMap[key]?.includes(callback)) {
      return;
    }

    eventSubscribeMap[key] ??= [];
    eventSubscribeMap[key].push(callback);
  }
  setListener<T>(method: string, callback: (data: T) => void) {
    const { eventSubscribeMap } = this;
    const key = ensurePrefix(method);
    eventSubscribeMap[key] = [callback];
  }

  removeListener<T>(method: string, callback: (data: T) => void) {
    const { eventSubscribeMap } = this;
    const key = ensurePrefix(method);
    const callbacks = eventSubscribeMap[key];
    eventSubscribeMap[key] = callbacks?.filter((fn) => fn !== callback);
  }

  removeAllListener(method: string) {
    const { eventSubscribeMap } = this;
    const key = ensurePrefix(method);
    eventSubscribeMap[key] = [];
  }

  listNotifications() {
    return this.call<string[]>("aria2.listNotifications");
  }

  listMethods() {
    return this.call<string[]>("aria2.listMethods");
  }

  close() {
    this.webSocketIns.close();
  }
}
