import { EVENT_SEARCH_SENT, Pipeline, Values } from "@sajari/sdk-react";
import get from "dlv";

import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "../../constants";
import {
  INTEGRATION_EVENT_OVERLAY_HIDE,
  INTEGRATION_EVENT_SEARCH_SENT,
  PubSub
} from "../../wsi";
import { updateQueryStringParam } from "./utils";

const ESCAPE_KEY_CODE = 27;

export const connector = (
  pubsub: PubSub,
  pipelines: {
    search: { pipeline: Pipeline; values: Values };
    instant: { pipeline: Pipeline; values: Values };
  },
  config: { [k: string]: any }
) => {
  const { mode } = config;
  const { search, instant } = pipelines;
  const searchPipelineName = get(config, "search.pipeline");

  switch (mode) {
    case INTEGRATION_TYPE_SEARCH_BOX:
      search.pipeline.search = (values: any) => {
        pubsub.emit(
          `${searchPipelineName}.${INTEGRATION_EVENT_SEARCH_SENT}`,
          values
        );
      };
      break;

    case INTEGRATION_TYPE_DYNAMIC_CONTENT:
      search.values.set(config.values || {});
      break;

    case INTEGRATION_TYPE_INLINE:
    case INTEGRATION_TYPE_OVERLAY:
      if (search) {
        const updateUrlParam = get(config, "integration.updateURLQueryParam");
        if (updateUrlParam) {
          search.pipeline.listen(
            EVENT_SEARCH_SENT,
            (values: { [k: string]: string }) => {
              updateQueryStringParam(
                get(config, "integration.urlQueryParam", "q"),
                get(values, get(config, "search.config.qParam"))
              );
            }
          );
        }
      }

      const searchQueryParam = get(config, "search.config.qParam");
      if (search.values.get()[searchQueryParam]) {
        const instantQueryParam = get(config, "instant.config.qParam");
        instant.values.set({
          [instantQueryParam]: search.values.get()[searchQueryParam]
        });
      }
      break;

    case INTEGRATION_TYPE_OVERLAY:
      window.document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
          pubsub.emit(INTEGRATION_EVENT_OVERLAY_HIDE);
        }
      });
      break;

    default:
      break;
  }
};
