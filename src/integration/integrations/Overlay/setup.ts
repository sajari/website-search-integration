import idx from "idx";
// @ts-ignore: module missing defintion file
import { Filter } from "sajari-react";

import { PubFn, SubFn } from "../../../lib/pubsub";
import {
  INTEGRATION_EVENT_OVERLAY_SHOW,
  INTEGRATION_EVENT_OVERLAY_HIDE
} from "../../../events";
import { IIntegrationConfig } from "../../../config";

export type Controls = { [k: string]: () => void };

export const setOverlayControls = (
  config: IIntegrationConfig,
  tabsFilter: Filter,
  pubsub: { publish: PubFn; subscribe: SubFn },
  pipelines: {
    search?: { pipeline: any; values: any };
    instant?: { pipeline: any; values: any };
  }
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
    if (config.tabFilters && config.tabFilters.defaultTab) {
      // @ts-ignore
      window.SJ_TAB_FACET_SEARCH_DISABLED = true;
      tabsFilter.set(config.tabFilters.defaultTab);
      // @ts-ignore
      window.SJ_TAB_FACET_SEARCH_DISABLED = false;
    }
    controls.hide();
  };

  const { subscribe } = pubsub;
  subscribe(INTEGRATION_EVENT_OVERLAY_SHOW, show);
  subscribe(INTEGRATION_EVENT_OVERLAY_HIDE, hide);

  return { show, hide };
};
