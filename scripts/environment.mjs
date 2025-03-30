import process from "process";

export const { cwd: cwdFn, platform, arch } = process;

export const isWin = platform === "win32";
