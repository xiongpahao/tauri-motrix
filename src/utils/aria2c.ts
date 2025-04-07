import { CallParam } from "@/services/aria2c";

export type JsonRpcRequest = {
  jsonrpc: string;
  id: string;
  method: string;
  params: CallParam[];
};

export function ensurePrefix(str: string) {
  if (!str.startsWith("system.") && !str.startsWith("aria2.")) {
    str = "aria2." + str;
  }
  return str;
}

export const createSocketResponseFactory = <T>(
  webSocketIns: WebSocket,
  message: JsonRpcRequest,
) =>
  new Promise<T>((resolve, reject) => {
    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (!data?.method && data.id === message.id) {
        webSocketIns.removeEventListener("message", onMessage);

        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      }
    };
    webSocketIns.addEventListener("message", onMessage);
    webSocketIns.send(JSON.stringify(message));
  });
