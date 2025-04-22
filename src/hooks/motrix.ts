import { useLockFn } from "ahooks";
import useSWR from "swr";

import { getMotrixConfig, patchMotrixConfig } from "@/services/cmd";

export function useMotrix() {
  const { data: motrix, mutate: mutateMotrix } = useSWR(
    "getMotrixConfig",
    getMotrixConfig,
  );

  const patchMotrix = useLockFn(
    async (data: Parameters<typeof patchMotrixConfig>[0]) => {
      await patchMotrixConfig(data);
      mutateMotrix();
    },
  );

  return {
    motrix,
    mutateMotrix,
    patchMotrix,
  };
}
