import "core-js/stable";
import "regenerator-runtime/runtime";

// @ts-ignore: module missing defintions file
import { flush } from "stackqueue";

import { initialize } from "./integration";
import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "./integration/constants";
import loaded from "./lib/loaded";
import { pub, PubFn, sub, SubFn } from "./lib/pubsub";
import { error, mount } from "./utils";

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
  if (!window.sajari) {
    throw new Error("window.sajari not found, needed for website-search");
  }

  if (!window.sajari.ui) {
    throw new Error("window.sajari.ui not found, needed for website-search");
  }

  window.sajari.ui.forEach((stack, index) => {
    const publish = pub(index);
    const subscribe = sub(index);

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
      [INTEGRATION_TYPE_DYNAMIC_CONTENT]: integration,
      [INTEGRATION_TYPE_INLINE]: integration,
      [INTEGRATION_TYPE_OVERLAY]: integration,
      [INTEGRATION_TYPE_SEARCH_BOX]: integration,
      pub: publish,
      sub: subscribe
    };

    for (let i = 0; i < stack.arr.length; i++) {
      if (typeof stack.arr[i][0] === "object") {
        if (!stack.arr[i][0].mode) {
          throw new Error("mode not found in config object");
        }
        stack.arr[i] = [stack.arr[i][0].mode, stack.arr[i][0]];
      }
    }

    const errors: Error[] = flush(stack, methods);
    if (errors.length > 0) {
      errors.forEach(error);
    }
  });
};

loaded(window, create);
