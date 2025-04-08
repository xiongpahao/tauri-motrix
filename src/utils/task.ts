import { Aria2Task } from "@/services/aria2c_api";

export const getTaskName = (task: Aria2Task, defaultName = "", maxLen = 64) => {
  let result = defaultName;
  if (!task) {
    return result;
  }

  const { files, bittorrent } = task;
  const total = files.length;

  if (bittorrent && bittorrent.info && bittorrent.info.name) {
    result = ellipsis(bittorrent.info.name, maxLen);
  } else if (total === 1) {
    result = getFileNameFromFile(files[0]);
    result = ellipsis(result, maxLen);
  }

  return result;
};

export const ellipsis = (str = "", maxLen = 64) => {
  const len = str.length;
  let result = str;
  if (len < maxLen) {
    return result;
  }

  if (maxLen > 0) {
    result = `${result.substring(0, maxLen)}...`;
  }

  return result;
};

export const getFileNameFromFile = (file: Aria2Task["files"][number]) => {
  if (!file) {
    return "";
  }

  let { path } = file;
  if (!path && file.uris && file.uris.length > 0) {
    path = decodeURI(file.uris[0].uri);
  }

  const index = path.lastIndexOf("/");

  if (index <= 0 || index === path.length) {
    return path;
  }

  return path.substring(index + 1);
};

export const timeRemaining = (
  totalLength: number,
  completedLength: number,
  downloadSpeed: number,
) => {
  const remainingLength = totalLength - completedLength;
  return Math.ceil(remainingLength / downloadSpeed);
};

interface TimeFormatI18 {
  gt1d?: string;
  hour?: string;
  minute?: string;
  second?: string;
}

export const timeFormat = (
  seconds: number,
  prefix = "",
  suffix = "",
  i18?: TimeFormatI18,
) => {
  let result = "";
  let hours = "";
  let minutes = "";
  let secs = seconds || 0;
  const i = {
    gt1d: "> 1 day",
    hour: "h",
    minute: "m",
    second: "s",
    ...i18,
  };

  if (secs <= 0) {
    return "";
  }
  if (secs > 86400) {
    return `${prefix} ${i.gt1d} ${suffix}`;
  }
  if (secs > 3600) {
    hours = `${Math.floor(secs / 3600)}${i.hour} `;
    secs %= 3600;
  }
  if (secs > 60) {
    minutes = `${Math.floor(secs / 60)}${i.minute} `;
    secs %= 60;
  }
  const secsSuffix = secs + i.second;
  result = hours + minutes + secsSuffix;
  return result ? `${prefix} ${result} ${suffix}` : result;
};
