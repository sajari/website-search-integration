import { Filter } from "@sajari/sdk-react";
import idx from "idx";

import { IntegrationConfig } from "../../../config";
import {
  INTEGRATION_EVENT_OVERLAY_HIDE,
  INTEGRATION_EVENT_OVERLAY_SHOW
} from "../../../events";
import { PubFn, SubFn } from "../../../lib/pubsub";
import { withSearchDisabled } from "../../initialize/filter";

export interface Controls {
  [k: string]: () => void;
}

export const setOverlayControls = (
  config: IntegrationConfig,
  pubsub: { publish: PubFn; subscribe: SubFn },
  pipelines: {
    search?: { pipeline: any; values: any };
    instant?: { pipeline: any; values: any };
  },
  tabsFilter?: Filter
) => (controls: Controls) => {
  const show = () => {
    window.document.body.style.overflow = "hidden";
    controls.show();
  };

  const hide = () => {
    window.document.body.style.overflow = "";
    // @ts-ignore: idx
    const pipeline = idx(pipelines, _ => _.search.pipeline);
    // @ts-ignore: idx
    const values = idx(pipelines, _ => _.search.values);

    if (pipeline) {
      values.set({ q: undefined, "q.override": undefined });
      pipeline.clearResponse(values.get());
    }

    // @ts-ignore: idx
    const instantPipeline = idx(pipelines, _ => _.instant.pipeline);
    // @ts-ignore: idx
    const instantValues = idx(pipelines, _ => _.instant.values);

    if (instantPipeline) {
      instantValues.set({ q: undefined, "q.override": undefined });
      instantPipeline.clearResponse(instantValues.get());
    }
    if (config.tabFilters && tabsFilter && config.tabFilters.defaultTab) {
      withSearchDisabled(() =>
        // @ts-ignore
        tabsFilter.set(config.tabFilters.defaultTab, true)
      );
    }
    controls.hide();
  };

  const { subscribe } = pubsub;
  subscribe(INTEGRATION_EVENT_OVERLAY_SHOW, show);
  subscribe(INTEGRATION_EVENT_OVERLAY_HIDE, hide);

  return { show, hide };
};
