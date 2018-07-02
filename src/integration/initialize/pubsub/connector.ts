import idx from "idx";
import { EVENT_SEARCH_SENT, Pipeline, Values } from "@sajari/sdk-react";

import { IntegrationConfig } from "../../../config";
import {
  INTEGRATION_EVENT_OVERLAY_HIDE,
  INTEGRATION_EVENT_OVERLAY_SHOW,
  INTEGRATION_EVENT_SEARCH_SENT
} from "../../../events";
import { PubFn, SubFn } from "../../../lib/pubsub";
import { updateQueryStringParam } from "./utils";

import { connectPubSub } from "./connectPubSub";

const ESCAPE_KEY_CODE = 27;

export const connector = (
  pubsub: { publish: PubFn; subscribe: SubFn },
  pipelines: {
    search?: { pipeline: Pipeline; values: Values };
    instant?: { pipeline: Pipeline; values: Values };
  },
  config: IntegrationConfig
) => {
  const { mode } = config;
  const { publish, subscribe } = pubsub;
  const { search, instant } = pipelines;

  switch (mode) {
    case "search-box":
      (search as { pipeline: Pipeline }).pipeline.search = (values: any) => {
        publish(`pipeline.${INTEGRATION_EVENT_SEARCH_SENT}`, values);
      };

      connectPubSub(
        publish,
        subscribe,
        "instantPipeline",
        (instant as { pipeline: Pipeline }).pipeline,
        (instant as { values: Values }).values,
        false
      );
      break;

    case "dynamic-content":
      connectPubSub(
        publish,
        subscribe,
        "pipeline",
        (search as { pipeline: Pipeline }).pipeline,
        (search as { values: Values }).values
      );
      (search as { values: Values }).values.set(config.values || {});

      if (config.searchOnLoad) {
        (search as { pipeline: Pipeline }).pipeline.search(
          (search as { values: Values }).values.get()
        );
      }
      break;

    case "inline":
    case "overlay":
      if (search) {
        connectPubSub(
          publish,
          subscribe,
          "pipeline",
          search.pipeline,
          search.values
        );

        search.pipeline.listen(
          EVENT_SEARCH_SENT,
          (values: { [k: string]: string }) => {
            updateQueryStringParam(config.urlQueryParam || "q", values.q);
          }
        );
      }

      if (instant) {
        connectPubSub(
          publish,
          subscribe,
          "instantPipeline",
          instant.pipeline,
          instant.values
        );
      }

      if (
        search &&
        search.values &&
        search.values.get().q &&
        (instant && instant.values)
      ) {
        instant.values.set({ q: search.values.get().q });
      }

    case "overlay":
      window.document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
          publish(INTEGRATION_EVENT_OVERLAY_HIDE);
        }
      });
      break;

    default:
      break;
  }
};
