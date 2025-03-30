import process from "process";

import { arch, isWin, platform } from "./environment.mjs";
import { createFetchOptionsFactory, log_error, log_info } from "./utils.mjs";

const ARIA2_URL_PREFIX = "https://github.com/aria2/aria2/releases/download";

const ARIA2_REPO_TAG_URL = "https://api.github.com/repos/aria2/aria2/tags";

const ARIA2_MAP = {
  "win32-x64": "win-64bit-build1",
  "win32-ia32": "win-32bit-build1",
  "win32-arm64": "win-64bit-build1",
};

/**
 * TODO
 */
export async function getLatestAria2Tag() {
  const options = createFetchOptionsFactory();

  try {
    const tagListRes = await fetch(ARIA2_REPO_TAG_URL, {
      ...options,
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
      },
    }).then((res) => res.json());

    const latestTag = tagListRes[0];

    const tag = latestTag?.name;
    // release-x.xx.x
    if (tag) {
      log_info(`Latest release tag: ${tag}`);

      return tag;
    } else {
      throw new Error("Invalid latest tag object.");
    }
  } catch (err) {
    log_error("Error fetching latest tag:", err.message);
    process.exit(1);
  }
}

/**
 *
 * @param {string} latestTag
 * @returns
 */
export function createAria2BinInfo(latestTag) {
  const name = ARIA2_MAP[`${platform}-${arch}`];
  const urlExt = "zip";
  const version = latestTag.split("-")[1];

  const downloadName = `aria2-${version}-${name}`;

  const downloadURL = `${ARIA2_URL_PREFIX}/${latestTag}/${downloadName}.${urlExt}`;
  const exeFile = `${downloadName}/aria2c${isWin ? ".exe" : ""}`;
  const zipFile = `${downloadName}.${urlExt}`;

  return {
    name: "aria2c",
    targetFile: `aria2c${isWin ? ".exe" : ""}`,
    exeFile,
    zipFile,
    downloadURL,
  };
}
