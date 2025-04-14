import { useLockFn } from "ahooks";
import useSWR from "swr";

import { getMotrixConfig } from "@/services/cmd";

export function useMotrix() {
  const { data: motrix, mutate: mutateMotrix } = useSWR(
    "getMotrixConfig",
    getMotrixConfig,
  );

  const patchMotrixConfig = useLockFn(async () => {
    // TODO
    mutateMotrix();
  });

  return {
    motrix,
    mutateMotrix,
    patchMotrixConfig,
  };
}
