import { useLockFn } from "ahooks";
import useSWR, { mutate } from "swr";

import { getAria2, getVersionApi } from "@/services/aria2c_api";
import { getAria2Config, getAria2Info, patchAria2Config } from "@/services/cmd";

export function useAria2() {
  const { data: aria2, mutate: mutateAria2 } = useSWR(
    "getAria2Config",
    getAria2Config,
  );

  const { data: versionData, mutate: mutateVersion } = useSWR(
    "getAria2Version",
    getVersionApi,
  );

  const patchConfig = useLockFn(
    async (data: Parameters<typeof patchAria2Config>[0]) => {
      await patchAria2Config(data);
      mutateAria2();
      getAria2(true);
    },
  );

  const version = versionData?.version;

  return {
    aria2,
    mutateAria2,
    version,
    versionData,
    mutateVersion,
    patchConfig,
  };
}

export function useAria2Info() {
  const { data: aria2Info, mutate: mutateInfo } = useSWR(
    "getAria2Info",
    getAria2Info,
  );

  const patchInfo = async (data: Record<string, string>) => {
    // TODO

    console.log("aria2 info change ", data);

    mutate("getAria2Config");
    mutate("getAria2Version");

    // update new instance
    getAria2(true);
  };

  return {
    aria2Info,
    mutateInfo,
    patchInfo,
  };
}
