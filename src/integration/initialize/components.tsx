import idx from "idx";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Filter, Pipeline, Values } from "@sajari/sdk-react";

import { IntegrationConfig } from "../../config";
import { PubFn, SubFn } from "../../lib/pubsub";
import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX,
} from "../constants";
import { DynamicContentResponse } from "../integrations/DynamicContentResponse";
import { Inline } from "../integrations/Inline";
import { Input } from "../integrations/Input";
import { Overlay, setOverlayControls } from "../integrations/Overlay";
import { SearchResponse } from "../integrations/SearchResponse";

type ComponentFn = () => React.ReactPortal;

export interface Pipelines {
  search?: { pipeline: Pipeline; values: Values };
  instant?: { pipeline: Pipeline; values: Values };
}

export const createComponents = (
  config: IntegrationConfig,
  pubsub: { publish: PubFn; subscribe: SubFn },
  pipelines: Pipelines,
  tabsFilter?: Filter
) => {
  const components: ComponentFn[] = [];
  let query = pipelines.search && pipelines.search.values.get()["q"];
  if (query === "") {
    query = undefined;
  }

  const { mode } = config;
  switch (mode) {
    case INTEGRATION_TYPE_SEARCH_BOX:
      components.push(() =>
        ReactDOM.createPortal(<Input config={config} />, config.attachSearchBox)
      );
      break;

    case INTEGRATION_TYPE_DYNAMIC_CONTENT:
      components.push(() =>
        ReactDOM.createPortal(
          <DynamicContentResponse config={config} />,
          config.attachDynamicContent
        )
      );
      break;

    case INTEGRATION_TYPE_INLINE:
      components.push(() =>
        ReactDOM.createPortal(
          <Inline config={config} defaultValue={query} />,
          config.attachSearchBox
        )
      );
      components.push(() =>
        ReactDOM.createPortal(
          <SearchResponse config={config} tabsFilter={tabsFilter} />,
          config.attachSearchResponse
        )
      );
      break;

    case INTEGRATION_TYPE_OVERLAY:
      const overlayContainerId = "sj-overlay-holder";
      // If multiple search inputs which all use overlay are on the screen, this may have already been created.
      let overlayContainer: Element;
      const existingContainer = document.querySelector(
        `#${overlayContainerId}`
      );
      if (existingContainer) {
        overlayContainer = existingContainer;
      } else {
        overlayContainer = document.createElement("div");
        overlayContainer.id = overlayContainerId;
        window.document.body.appendChild(overlayContainer);
      }

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
    <React.Fragment>
      {components.map((component) => component())}
    </React.Fragment>
  );
};
