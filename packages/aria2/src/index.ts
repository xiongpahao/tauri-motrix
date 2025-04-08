import { Aria2, Aria2InstanceConfig } from "@root/packages/aria2/src/aria2";
import { defaultConfigObj } from "@root/packages/aria2/src/util";

export const create = (instanceConfig: Aria2InstanceConfig) =>
  new Aria2({ ...defaultConfigObj, ...instanceConfig });

export { Aria2 };
