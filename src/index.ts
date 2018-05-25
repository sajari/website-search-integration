// @ts-ignore: module missing defintions file
import { flush } from "stackqueue";

import loaded from "./lib/loaded";
import { pub, sub, PubFn, SubFn } from "./lib/pubsub";
import { initialize } from "./integration";
import { mount, error } from "./utils";

export const setup = (
  window: Window,
  publish: PubFn,
  subscribe: SubFn,
  configured: () => boolean,
  onConfigured: () => void
) => (config: any) => {
  if (configured()) {
    throw new Error("website search interface can only be configured once");
  }

  mount(window, initialize(config, publish, subscribe));
  onConfigured();
};

const create = (window: Window, type?: string) => {
  // @ts-ignore: in our case sajari is a member of window
  if (!window.sajari) {
    throw new Error("window.sajari not found, needed for website-search");
  }

  // @ts-ignore: in our case sajari is a member of window
  if (!window.sajari.ui) {
    throw new Error("window.sajari.ui not found, needed for website-search");
  }

  // @ts-ignore: in our case sajari is a member of window
  window.sajari.ui.forEach((s, i) => {
    const publish = pub(i);
    const subscribe = sub(i);

    let configured = false;
    const isConfigured = () => configured;
    const onConfigured = () => (configured = true);

    const integration = setup(
      window,
      publish,
      subscribe,
      isConfigured,
      onConfigured
    );

    const methods = {
      pub: publish,
      sub: subscribe,
      "search-box": integration,
      inline: integration,
      overlay: integration,
      "dynamic-content": integration
    };

    for (let i = 0; i < s.arr.length; i++) {
      if (typeof s.arr[i][0] === "object") {
        if (!s.arr[i][0].mode) {
          throw new Error("mode not found in config object");
        }
        s.arr[i] = [s.arr[i][0].mode, s.arr[i][0]];
      }
    }

    const errors: any[] = flush(s, methods);
    if (errors.length > 0) {
      errors.forEach(error);
    }
  });
};

loaded(window, create);
