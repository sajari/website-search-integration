import { EVENT_SEARCH_SENT, Pipeline, Values } from "@sajari/sdk-react";
import idx from "idx";

import { IntegrationConfig } from "../../../config";
import {
  INTEGRATION_EVENT_OVERLAY_HIDE,
  INTEGRATION_EVENT_OVERLAY_SHOW,
  INTEGRATION_EVENT_SEARCH_SENT
} from "../../../events";
import { PubFn, SubFn } from "../../../lib/pubsub";
import { updateQueryStringParam } from "./utils";

import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "../../constants";
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
    case INTEGRATION_TYPE_SEARCH_BOX:
      if (!search) {
        throw new Error(
          `search must be defined for integrations of type ${INTEGRATION_TYPE_SEARCH_BOX}`
        );
      }
      if (!instant) {
        throw new Error(
          `instant must be defined for integrations of type ${INTEGRATION_TYPE_SEARCH_BOX}`
        );
      }

      search.pipeline.search = (values: any) => {
        publish(`pipeline.${INTEGRATION_EVENT_SEARCH_SENT}`, values);
      };

      connectPubSub(
        publish,
        subscribe,
        "instantPipeline",
        instant.pipeline,
        instant.values,
        false
      );
      break;

    case INTEGRATION_TYPE_DYNAMIC_CONTENT:
      if (!search) {
        throw new Error(
          `search must be defined for integrations of type ${INTEGRATION_TYPE_DYNAMIC_CONTENT}`
        );
      }

      connectPubSub(
        publish,
        subscribe,
        "pipeline",
        search.pipeline,
        search.values
      );
      search.values.set(config.values || {});
      break;

    case INTEGRATION_TYPE_INLINE:
    case INTEGRATION_TYPE_OVERLAY:
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

    case INTEGRATION_TYPE_OVERLAY:
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
