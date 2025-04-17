import { useLockFn } from "ahooks";
import useSWR from "swr";

import { getAria2, getVersionApi } from "@/services/aria2c_api";
import { getAria2Config } from "@/services/cmd";

export function useAria2() {
  const { data: aria2, mutate: mutateAria2 } = useSWR(
    "getAria2Config",
    getAria2Config,
  );

  const { data: versionData, mutate: mutateVersion } = useSWR(
    "getAria2Version",
    getVersionApi,
  );

  const patchAria2Config = useLockFn(async () => {
    // TODO
    mutateAria2();
    getAria2(true);
  });

  const version = versionData?.version;

  return { aria2, mutateAria2, version, mutateVersion, patchAria2Config };
}
