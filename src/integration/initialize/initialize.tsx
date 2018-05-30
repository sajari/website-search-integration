import idx from "idx";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { defaultConfig, IntegrationConfig } from "../../config";
import { PubFn, SubFn } from "../../lib/pubsub";

import { createComponents } from "./components";
import { setUpTabsFilters } from "./filter";
import { createPipelineConfigs, initializePipelines } from "./pipelines";
import { pubsubConnector } from "./pubsub";
import { validateConfig } from "./validate";

import { Integration } from "../containers/Integration";

export const initialize = (
  config: IntegrationConfig,
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
      mode={config.mode}
      publish={publish}
      search={search && { ...search, config: providerConfig }}
      instant={instant && { ...instant, config: providerConfig }}
    >
      <Components />
    </Integration>
  );
};
