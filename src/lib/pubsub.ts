// @ts-ignore: module missing defintions file
import PubSub from "pubsub-js";

export type PubFn = (event: string, ...data: any[]) => void;
export type SubFn = (event: string, fn: SubCallback) => void;
export type SubCallback = (...args: any[]) => void;

export const pub = (index: number) => (event: string, ...data: any[]) =>
  PubSub.publish(`${index}.${event}`, ...data);

export const sub = (index: number) => (event: string, fn: SubCallback) => {
  if (event === "*") {
    PubSub.subscribe(`${index}`, fn);
    return;
  }
  PubSub.subscribe(`${index}.${event}`, fn);
};
