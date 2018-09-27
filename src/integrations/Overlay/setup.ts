import { Filter, Pipeline, Values } from "@sajari/sdk-react";
import get from "dlv";

import { withSearchDisabled } from "../../initialize/filter";
import {
  INTEGRATION_EVENT_OVERLAY_HIDE,
  INTEGRATION_EVENT_OVERLAY_SHOW,
  PubSub
} from "../../wsi";

export interface Controls {
  [k: string]: () => void;
}

export const setOverlayControls = (
  config: { [k: string]: any },
  pubsub: PubSub,
  pipelines: {
    search: { pipeline: Pipeline; values: Values };
    instant: { pipeline: Pipeline; values: Values };
  },
  tabsFilter?: Filter
) => (controls: Controls) => {
  const show = () => {
    window.document.body.style.overflow = "hidden";
    controls.show();
  };

  const hide = () => {
    window.document.body.style.overflow = "";

    const searchQueryParam = get(config, "search.config.qParam");
    const searchQueryOverrideParam = get(
      config,
      "search.config.qOverrideParam"
    );
    pipelines.search.values.set({
      [searchQueryParam]: undefined,
      [searchQueryOverrideParam]: undefined
    });
    pipelines.search.pipeline.clearResponse(pipelines.search.values.get());

    const instantQueryParam = get(config, "instant.config.qParam");
    const instantQueryOverrideParam = get(
      config,
      "instant.config.qOverrideParam"
    );
    pipelines.instant.values.set({
      [instantQueryParam]: undefined,
      [instantQueryOverrideParam]: undefined
    });
    pipelines.instant.pipeline.clearResponse(pipelines.instant.values.get());

    const configDefaultTab = get(
      config,
      "integration.tabFilters.defaultTab",
      false
    );
    if (tabsFilter && configDefaultTab) {
      withSearchDisabled(() => tabsFilter.set(configDefaultTab, true));
    }
    controls.hide();
  };

  pubsub.on(INTEGRATION_EVENT_OVERLAY_SHOW, show);
  pubsub.on(INTEGRATION_EVENT_OVERLAY_HIDE, hide);

  return { show, hide };
};
