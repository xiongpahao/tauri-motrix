import path from "path";
import process from "process";

export const { cwd: cwdFn, platform, arch } = process;

export const cwd = cwdFn();

export const isWin = platform === "win32";

/**
 * Special directory to store temporary files for tauri-motrix
 */
export const TEMP_DIR = path.join(cwd, "node_modules/.tauri-motrix");
