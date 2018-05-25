import * as React from "react";
import * as ReactDOM from "react-dom";

// @ts-ignore: module missing definintions file
import { Filter } from "sajari-react";

import { IIntegrationConfig } from "../../config";
import { Input } from "../integrations/Input";
import { Inline } from "../integrations/Inline";
import { SearchResponse } from "../integrations/SearchResponse";
import { DynamicContentResponse } from "../integrations/DynamicContentResponse";

type ComponentFn = () => React.ReactPortal;

export const createComponents = (
  config: IIntegrationConfig,
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
      throw new Error("overlay not set");

    default:
      break;
  }

  return () => (
    <React.Fragment>{components.map(component => component())}</React.Fragment>
  );
};
