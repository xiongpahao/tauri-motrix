export const SPEED_UNITS = [
  {
    label: "KB/s",
    value: "KB",
  },
  {
    label: "MB/s",
    value: "MB",
  },
] as const;

export type SpeedUnit = (typeof SPEED_UNITS)[number]["value"];
