import clc from "cli-color";
import fsp from "fs/promises";
import { HttpsProxyAgent } from "https-proxy-agent";
import process from "process";

export const log_success = (msg, ...optionalParams) =>
  console.log(clc.green(msg), ...optionalParams);
export const log_error = (msg, ...optionalParams) =>
  console.log(clc.red(msg), ...optionalParams);
export const log_info = (msg, ...optionalParams) =>
  console.log(clc.bgBlue(msg), ...optionalParams);

const debugMsg = clc.xterm(245);
export const log_debug = (msg, ...optionalParams) =>
  console.log(debugMsg(msg), ...optionalParams);

export const createFetchOptionsFactory = () => {
  const options = {};

  const httpProxy =
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    process.env.HTTPS_PROXY ||
    process.env.https_proxy;

  if (httpProxy) {
    options.agent = new HttpsProxyAgent(httpProxy);
  }

  return options;
};

/**
 * download file and save to `path`
 */
export async function downloadFile(url, path) {
  const options = createFetchOptionsFactory();
  const response = await fetch(url, {
    ...options,
    method: "GET",
    headers: { "Content-Type": "application/octet-stream" },
  });
  const buffer = await response.arrayBuffer();
  await fsp.writeFile(path, new Uint8Array(buffer));

  log_success(`download finished: ${url}`);
}
