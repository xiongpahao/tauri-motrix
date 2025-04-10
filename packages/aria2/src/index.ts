import { Aria2, Aria2InstanceConfig } from "./aria2";
import { defaultOption } from "./util";

export const create = (instanceConfig?: Partial<Aria2InstanceConfig>) =>
  new Aria2({ ...defaultOption, ...instanceConfig });

// type DefaultAria2 = {
//   [key in keyof Aria2]: Aria2[key];
// } & {
//   <T>(method: string): Promise<T>;
// };

// const instance = create();

// const call: DefaultAria2 = (method: string) => {
//   instance.open();
//   return instance.call(method);
// };

// call.call = instance.call.bind(instance);
// call.open = instance.open.bind(instance);
// call.close = instance.close.bind(instance);
// call.eventSubscribeMap = instance.eventSubscribeMap;
// call.socketPendingMap = instance.socketPendingMap;
// call.fetcher = instance.fetcher;
// call.webSocketIns = instance.webSocketIns;
// call.addListener = instance.addListener.bind(instance);
// call.removeListener = instance.removeListener.bind(instance);
// call.removeAllListener = instance.removeAllListener.bind(instance);
// call.setListener = instance.setListener.bind(instance);
// call.listNotifications = instance.listNotifications.bind(instance);
// call.listMethods = instance.listMethods.bind(instance);
// call.multiCall = instance.multiCall.bind(instance);

// export default call;

export { Aria2 };

export type {
  Aria2InstanceConfig,
  EventSubscribeMap,
  SocketPendingMap,
} from "./aria2";
