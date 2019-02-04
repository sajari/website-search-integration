declare module "pubsub-js" {
  export type SubscriptionCallback = (...args: any[]) => void;

  export function publish(event: string, ...data: any[]): void;
  export function subscribe(event: string, cb: SubscriptionCallback): void;
}
