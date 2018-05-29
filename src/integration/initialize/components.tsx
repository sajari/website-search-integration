import * as React from "react";
import * as ReactDOM from "react-dom";

// @ts-ignore: module missing definintions file
import { Filter } from "sajari-react";

import { IIntegrationConfig } from "../../config";
import { PubFn, SubFn } from "../../lib/pubsub";
import { Input } from "../integrations/Input";
import { Inline } from "../integrations/Inline";
import { SearchResponse } from "../integrations/SearchResponse";
import { DynamicContentResponse } from "../integrations/DynamicContentResponse";
import { Overlay, setOverlayControls } from "../integrations/Overlay";

type ComponentFn = () => React.ReactPortal;

export const createComponents = (
  config: IIntegrationConfig,
  pubsub: { publish: PubFn; subscribe: SubFn },
  pipelines: {
    search?: { pipeline: any; values: any };
    instant?: { pipeline: any; values: any };
  },
  tabsFilter?: Filter
) => {
  let components: ComponentFn[] = [];

  const { mode } = config;
  switch (mode) {
    case "search-box":
      components.push(() =>
        ReactDOM.createPortal(<Input config={config} />, config.attachSearchBox)
      );
      break;

    case "dynamic-content":
      components.push(() =>
        ReactDOM.createPortal(
          <DynamicContentResponse config={config} />,
          config.attachDynamicContent
        )
      );
      break;

    case "inline":
      components.push(() =>
        ReactDOM.createPortal(
          <Inline config={config} />,
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

    case "overlay":
      const overlayContainer = document.createElement("div");
      overlayContainer.id = "sj-overlay-holder";
      window.document.body.appendChild(overlayContainer);

      const controls = setOverlayControls(
        config,
        tabsFilter,
        pubsub,
        pipelines
      );

      components.push(() =>
        ReactDOM.createPortal(
          <Overlay
            config={config}
            tabsFilter={tabsFilter}
            setOverlayControls={controls}
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
