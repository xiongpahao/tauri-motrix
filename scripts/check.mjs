import fsp from "fs/promises";
import path from "path";
import process from "process";

import { log_error, log_success } from "./utils.mjs";

const { cwd: cwdFn } = process;
const cwd = cwdFn();

/**
 * TODO
 */
async function resolveLocales() {
  const srcLocalesDir = path.join(cwd, "src/locales");
  const targetLocalesDir = path.join(cwd, "src-tauri/resources/locales");

  try {
    // ensure locales dir exists
    await fsp.mkdir(targetLocalesDir, { recursive: true });

    const files = await fsp.readdir(srcLocalesDir);

    // copy all locale files
    for (const file of files) {
      const srcPath = path.join(srcLocalesDir, file);
      const targetPath = path.join(targetLocalesDir, file);

      await fsp.copyFile(srcPath, targetPath);
      log_success(`Copied locale file: ${file}`);
    }

    log_success("All locale files copied successfully");
  } catch (err) {
    log_error("Error copying locale files:", err?.message ?? err);
    throw err;
  }
}

/**
 * @type { Array<{ name: string, func: Function, retry: number}> }
 */
const tasks = [
  {
    name: "locales",
    func: resolveLocales,
    retry: 2,
  },
];

async function runTask() {
  const task = tasks.shift();
  if (!task) return;

  for (let i = 0; i < task.retry; i++) {
    try {
      await task.func();
      break;
    } catch (err) {
      log_error(`task::${task.name} try ${i} ==`, err.message);
      if (i === task.retry - 1) throw err;
    }
  }
  return runTask();
}

runTask();
