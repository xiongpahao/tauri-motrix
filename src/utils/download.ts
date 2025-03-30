const units = ["B", "KB", "MB", "GB", "TB"];

export const calcDownloadByteVo = (byte: number, suffix: string = "") => {
  let size = byte;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}${suffix}`;
};
