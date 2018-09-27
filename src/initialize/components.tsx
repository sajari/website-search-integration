import get from "dlv";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Filter, Pipeline, Values } from "@sajari/sdk-react";

import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "../constants";
import { DynamicContentResponse } from "../integrations/DynamicContentResponse";
import { Inline } from "../integrations/Inline";
import { Input } from "../integrations/Input";
import { Overlay, setOverlayControls } from "../integrations/Overlay";
import { SearchResponse } from "../integrations/SearchResponse";
import { PubSub } from "../wsi";

type ComponentFn = () => React.ReactPortal;

export interface Pipelines {
  search: { pipeline: Pipeline; values: Values };
  instant: { pipeline: Pipeline; values: Values };
}

export const createComponents = (
  config: { [k: string]: any },
  pubsub: PubSub,
  pipelines: Pipelines,
  tabsFilter?: Filter
) => {
  const components: ComponentFn[] = [];
  const values = get(pipelines, "search.values", undefined);
  let query: string | undefined;
  if (values !== undefined) {
    query = values.get()[get(config, "search.config.qParam", "q")];
    if (query === "") {
      query = undefined;
    }
  }
  let targetID: HTMLElement | null;

  const { mode } = config;
  switch (mode) {
    case INTEGRATION_TYPE_SEARCH_BOX:
      targetID = get(config, "render.targets.searchBox", null);
      if (targetID === null) {
        throw new Error(
          "no render target found, search-box requires render.targets.searchBox to be set"
        );
      }
      components.push(() =>
        ReactDOM.createPortal(
          <Input config={config} />,
          targetID as HTMLElement
        )
      );
      break;

    case INTEGRATION_TYPE_DYNAMIC_CONTENT:
      targetID = get(config, "render.targets.dynamicContent", null);
      if (targetID === null) {
        throw new Error(
          "no render target found, dynamic-content requires render.targets.dynamicContent to be set"
        );
      }
      components.push(() =>
        ReactDOM.createPortal(
          <DynamicContentResponse config={config} />,
          targetID as HTMLElement
        )
      );
      break;

    case INTEGRATION_TYPE_INLINE:
      targetID = get(config, "render.targets.searchBox", null);
      if (targetID === null) {
        throw new Error(
          "no render target found, inline requires render.targets.searchBox to be set"
        );
      }
      components.push(() =>
        ReactDOM.createPortal(
          <Inline config={config} defaultValue={query} />,
          targetID as HTMLElement
        )
      );

      const secondaryTargetID = get(
        config,
        "render.targets.searchResponse",
        null
      );
      if (secondaryTargetID === null) {
        throw new Error(
          "no render target found, inline requires render.targets.searchResponse to be set"
        );
      }
      components.push(() =>
        ReactDOM.createPortal(
          <SearchResponse config={config} tabsFilter={tabsFilter} />,
          secondaryTargetID as HTMLElement
        )
      );
      break;

    case INTEGRATION_TYPE_OVERLAY:
      const overlayContainer = document.createElement("div");
      overlayContainer.id = "sj-overlay-holder";
      window.document.body.appendChild(overlayContainer);

      const controls = setOverlayControls(
        config,
        pubsub,
        pipelines,
        tabsFilter
      );

      components.push(() =>
        ReactDOM.createPortal(
          <Overlay
            config={config}
            tabsFilter={tabsFilter}
            setOverlayControls={controls}
            defaultValue={query}
          />,
          overlayContainer
        )
      );

    default:
      break;
  }

  return () => (
    <React.Fragment>{components.map(component => component())}</React.Fragment>
  );
};
