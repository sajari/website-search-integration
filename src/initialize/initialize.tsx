import { Pipeline, Values } from "@sajari/sdk-react";
import get from "dlv";
import * as React from "react";

import { schema } from "../config";
import { PubSub } from "../wsi";

import { createComponents } from "./components";
import { setUpTabsFilters } from "./filter";
import { localization } from "./i18n";
import { pubsubConnector } from "./pubsub";

import { Integration } from "../containers/Integration";

export function initialize(
  config: { [k: string]: any },
  pubsub: PubSub,
  pipelines: {
    search: { pipeline: Pipeline; values: Values; config: any };
    instant: { pipeline: Pipeline; values: Values; config: any };
  }
) {
  config = schema.validateSync(config);

  localization(config);
  pubsubConnector(pubsub, pipelines, config);
  const tabsFilter = setUpTabsFilters(config, pipelines.search);
  const Components = createComponents(config, pubsub, pipelines, tabsFilter);
  // @ts-ignore: set display name for component
  Components.displayName = "Components";

  const theme = {
    layout: { type: get(config, "render.layout") },
    colors: { brand: { primary: get(config, "render.color") } }
  };

  // trigger the search on load, after all setup as been completed
  const vals = pipelines.search.values.get();
  const searchQParam = pipelines.search.config.qParam;
  if (
    (vals[searchQParam] !== "" && vals[searchQParam] != null) ||
    get(config, "integration.searchOnLoad", false)
  ) {
    pipelines.search.pipeline.search(pipelines.search.values.get());
  }

  return () => (
    <Integration
      mode={config.mode}
      pubsub={pubsub}
      search={pipelines.search}
      instant={pipelines.instant}
      theme={theme}
    >
      <Components />
    </Integration>
  );
}
