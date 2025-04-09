import {
  CallParam,
  createFetcherFactory,
  ensurePrefix,
  MultiCall,
} from "./util";

export type EventSubscribeMap = Record<
  string,
  Array<(data: MessageEvent["data"]) => void> | undefined
>;

export type SocketPendingMap = Record<
  string,
  {
    resolve: (data: MessageEvent["data"]) => void;
    reject: (data: unknown) => void;
    timer: number;
  }
>;

export interface Aria2InstanceConfig {
  server: string;
  eventSubscribeMap?: EventSubscribeMap;
  socketPendingMap?: SocketPendingMap;
  timeout: number;
  isHttps?: boolean;
  isWss?: boolean;
}

export class Aria2 {
  eventSubscribeMap: EventSubscribeMap;
  socketPendingMap: SocketPendingMap;

  webSocketIns?: WebSocket;
  fetcher: ReturnType<typeof createFetcherFactory>;

  constructor(private instanceConfig: Aria2InstanceConfig) {
    const { server, eventSubscribeMap, socketPendingMap, isHttps, timeout } =
      instanceConfig;

    this.fetcher = createFetcherFactory(
      `http${isHttps ? "s" : ""}://${server}/jsonrpc`,
      timeout,
    );

    this.eventSubscribeMap = eventSubscribeMap || {};
    this.socketPendingMap = socketPendingMap || {};
  }

  open() {
    const { eventSubscribeMap, instanceConfig } = this;
    const { server, isWss } = instanceConfig;
    const webSocketIns = new WebSocket(
      `ws${isWss ? "s" : ""}://${server}/jsonrpc`,
    );
    this.webSocketIns = webSocketIns;

    webSocketIns.onopen = (event) => {
      console.log("aria2", "WebSocket OPEN");
      eventSubscribeMap.open?.forEach((fn) => fn(event));
    };

    webSocketIns.onclose = (event) => {
      console.log("aria2", "WebSocket CLOSE");
      eventSubscribeMap.close?.forEach((fn) => fn(event));
    };

    webSocketIns.onmessage = (message: MessageEvent) => {
      let data;
      try {
        data = JSON.parse(message.data);
      } catch (err) {
        console.error("aria2", "JSON parse failed", err, message);
        return;
      }
      if (Array.isArray(data)) {
        data.forEach((item) => this.#handleMessage(item));
      } else {
        this.#handleMessage(data);
      }
    };

    webSocketIns.onerror = (error) => {
      console.error("aria2", "WebSocket ERROR", error);
      eventSubscribeMap.error?.forEach((fn) => fn(error));
    };
  }

  #handleMessage(data: MessageEvent["data"]) {
    const { eventSubscribeMap, socketPendingMap } = this;
    const { method: key, id: messageId } = data;

    if (!messageId && key in eventSubscribeMap) {
      const callbacks = eventSubscribeMap[key];
      callbacks?.forEach((fn) => fn(data.params));
    }

    if (!key && messageId in socketPendingMap) {
      const pending = socketPendingMap[messageId];
      clearTimeout(pending.timer);
      delete socketPendingMap[messageId];
      if (data.error) {
        pending.reject(data.error);
      } else {
        pending.resolve(data.result);
      }
    }
  }

  call<T>(method: string, ...params: CallParam[]): Promise<T> {
    const message = {
      jsonrpc: "2.0",
      id: Date.now().toString(),
      method: ensurePrefix(method),
      params,
    };

    const { socketPendingMap, webSocketIns, fetcher, instanceConfig } = this;

    if (webSocketIns?.readyState === WebSocket.OPEN) {
      return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => {
          delete socketPendingMap[message.id];
          reject(new Error("Request timed out."));
        }, instanceConfig.timeout);
        socketPendingMap[message.id] = { resolve, reject, timer };
        webSocketIns.send(JSON.stringify(message));
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
    this.webSocketIns?.close();
  }
}
