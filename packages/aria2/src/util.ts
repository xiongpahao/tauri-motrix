export type CallParam = string | boolean | number | object | CallParam[];

export type MultiCall = Array<{
  method: string;
  params: CallParam;
}>;

export const createFetcherFactory =
  (server: string) =>
  <T>(data: object) =>
    fetch(`http://${server}/jsonrpc`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return Promise.reject(res.error);
        }
        return res.result as T;
      });

export function ensurePrefix(str: string) {
  if (!str.startsWith("system.") && !str.startsWith("aria2.")) {
    str = "aria2." + str;
  }
  return str;
}

export const defaultConfigObj = {
  server: "127.0.0.1:6800",
};
