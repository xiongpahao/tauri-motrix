import { Aria2, Aria2InstanceConfig } from "./aria2";
import { defaultConfigObj } from "./util";

export const create = (instanceConfig: Aria2InstanceConfig) =>
  new Aria2({ ...defaultConfigObj, ...instanceConfig });

export { Aria2 };

export type {
  Aria2InstanceConfig,
  EventSubscribeMap,
  SocketPendingMap,
} from "./aria2";
