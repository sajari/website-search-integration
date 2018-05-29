import * as React from "react";
import * as ReactDOM from "react-dom";
import idx from "idx";

import { PubFn, SubFn } from "../../lib/pubsub";
import { IIntegrationConfig, defaultConfig } from "../../config";

import { validateConfig } from "./validate";
import { initializePipelines, createPipelineConfigs } from "./pipelines";
import { pubsubConnector } from "./pubsub";
import { setUpTabsFilters } from "./filter";
import { createComponents } from "./components";

import { Integration } from "../containers/Integration";

export const initialize = (
  config: IIntegrationConfig,
  publish: PubFn,
  subscribe: SubFn
) => {
  validateConfig(config);
  const pipelineConfigs = createPipelineConfigs(config);
  const { search, instant } = initializePipelines({
    project: config.project,
    collection: config.collection,
    search: pipelineConfigs.search,
    instant: pipelineConfigs.instant
  });
  pubsubConnector({ publish, subscribe }, { search, instant }, config);
  const tabsFilter = setUpTabsFilters(
    config,
    // @ts-ignore: idx
    idx(search, _ => _.pipeline) || idx(instant, _ => _.pipeline),
    // @ts-ignore: idx
    idx(search, _ => _.values) || idx(instant, _ => _.values)
  );

  const Components = createComponents(
    config,
    { publish, subscribe },
    { search, instant },
    tabsFilter
  );
  // @ts-ignore
  Components.displayName = "Components";

  const providerConfig = {
    maxSuggestions: String(
      config.maxSuggestions || defaultConfig.maxSuggestions
    )
  };

  return () => (
    <Integration
      search={search && { ...search, config: providerConfig }}
      instant={instant && { ...instant, config: providerConfig }}
    >
      <Components />
    </Integration>
  );
};
