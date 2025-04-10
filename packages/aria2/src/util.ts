export type CallParam = string | boolean | number | object | CallParam[];

export type MultiCall = Array<{
  method: string;
  params: CallParam;
}>;

export const createFetcherFactory =
  (url: string, timeout: number) =>
  <T>(data: object) =>
    new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Request timeout"));
      }, timeout);

      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            return Promise.reject(res.error);
          }
          resolve(res.result as T);
        })
        .catch((err) => reject(err))
        .finally(() => clearTimeout(timer));
    });

export function ensurePrefix(str: string) {
  if (!str.startsWith("system.") && !str.startsWith("aria2.")) {
    str = "aria2." + str;
  }
  return str;
}

export const defaultOption = {
  server: "127.0.0.1:6800",
  timeout: 15000,
};
