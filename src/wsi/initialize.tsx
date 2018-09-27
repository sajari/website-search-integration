import { Pipeline, Values } from "@sajari/sdk-react";
import { flush, Stack } from "@sajari/stack";
import cuid from "cuid";
import PubSubJS from "pubsub-js";
import * as React from "react";
import { render } from "react-dom";
import { schema } from "../config";
import { logError } from "../utils";
import { createPipelinesAndValues } from "./pipeline";
import { PubSub } from "./pubsub";

interface Pipelines {
  search: {
    pipeline: Pipeline;
    values: Values;
    config: {
      qParam: string;
      qOverrideParam: string;
      qSuggestionsParam: string;
      maxSuggestions: number;
      resultsPerPageParam: string;
      pageParam: string;
    };
  };
  instant: {
    pipeline: Pipeline;
    values: Values;
    config: {
      qParam: string;
      qOverrideParam: string;
      qSuggestionsParam: string;
      maxSuggestions: number;
      resultsPerPageParam: string;
      pageParam: string;
    };
  };
}

export type IntegrationFn = (
  config: any,
  pubsub: PubSub,
  pipelines: Pipelines
) => React.ComponentType<any>;

export function setup(
  integration: IntegrationFn
): (config: any, pubsub: PubSub, pipelines: Pipelines) => void {
  return function integrationWrapper(
    config: any,
    pubsub: PubSub,
    pipelines: any
  ) {
    mount(integration(config, pubsub, pipelines));
  };
}

function mount(Component: React.ComponentType<any>) {
  const container = document.createElement("div");
  container.id = "sj-" + cuid();
  document.body.appendChild(container);
  render(<Component />, container);
}

export function initialize(methods: {
  [k: string]: (config: any, pubsub: PubSub, pipelines: Pipelines) => void;
}): () => void {
  return function create() {
    if (window.sajari == undefined || window.sajari.ui == undefined) {
      throw new Error("sajari search integration not initialized");
    }

    window.sajari.ui.forEach((stack: Stack, idx: number) => {
      const pubsub = new PubSub(idx);

      const m = Object.entries(methods).reduce(
        (obj, [key, fn]) => {
          obj[key] = function stackMethod(config: any) {
            config = schema.validateSync(config);
            console.log(config);
            const pipelines = createPipelinesAndValues(config, pubsub);
            fn(config, pubsub, pipelines);
          };
          return obj;
        },
        {} as { [k: string]: any }
      );

      m.pub = (event: string, ...args: any[]) => pubsub.emit(event, ...args);
      m.sub = (event: string, fn: PubSubJS.SubscriptionCallback) =>
        pubsub.on(event, fn);

      stack = pullModeFromStack(stack);
      flush(stack, m).forEach(err => {
        if (err) {
          logError(err.message);
        }
      });
    });
  };
}

function pullModeFromStack(stack: Stack) {
  for (let i = 0; i < stack.arr.length; i++) {
    if (typeof stack.arr[i][0] === "object") {
      if (!stack.arr[i][0].mode) {
        throw new Error("mode not found in config object");
      }
      stack.arr[i] = [stack.arr[i][0].mode, stack.arr[i][0]];
    }
  }
  return stack;
}
