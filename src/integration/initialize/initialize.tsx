import idx from "idx";
import * as React from "react";
import isPlainObject from "is-plain-object";
import merge from "deepmerge";

import { defaultConfig, IntegrationConfig } from "../../config";
import { PubFn, SubFn } from "../../lib/pubsub";

import { createComponents } from "./components";
import { setUpTabsFilters } from "./filter";
import { localization } from "./i18n";
import { createPipelineConfigs, initializePipelines } from "./pipelines";
import { pubsubConnector } from "./pubsub";
import { validateConfig } from "./validate";

import { Integration } from "../containers/Integration";

export const initialize = (
  config: IntegrationConfig,
  publish: PubFn,
  subscribe: SubFn
) => {
  // merge the defaultConfig with the provided config
  config = merge(defaultConfig, config, {
    isMergeableObject: isPlainObject
  });
  validateConfig(config);
  localization(config);
  const pipelineConfigs = createPipelineConfigs(config);
  const { search, instant } = initializePipelines({
    project: config.project,
    collection: config.collection,
    search: pipelineConfigs.search,
    instant: pipelineConfigs.instant
  });
  pubsubConnector({ publish, subscribe }, { search, instant }, config);

  const pipeline =
    // @ts-ignore: idx
    idx(search, _ => _.pipeline) || idx(instant, _ => _.pipeline);
  // @ts-ignore: idx
  const values = idx(search, _ => _.values) || idx(instant, _ => _.values);

  // @ts-ignore: idx
  const tabsFilter = setUpTabsFilters(config, pipeline, values);

  const Components = createComponents(
    config,
    { publish, subscribe },
    { search, instant },
    tabsFilter
  );
  // @ts-ignore: set display name for component
  Components.displayName = "Components";

  const providerConfig = {
    maxSuggestions: String(
      config.maxSuggestions || defaultConfig.maxSuggestions
    )
  };

  // @ts-ignore: idx
  const theme = idx(config, _ => _.styling.theme) as
    | { [k: string]: any }
    | undefined;

  // trigger the search on load, after all setup as been completed
  let vals = values != null ? values.get() : ({} as { [k: string]: string });
  if ((vals["q"] !== "" && vals["q"] != null) || config.searchOnLoad) {
    if (pipeline != null && values != null) {
      pipeline.search(values.get());
    }
  }

  return () => (
    <Integration
      mode={config.mode}
      publish={publish}
      search={search && { ...search, config: providerConfig }}
      instant={instant && { ...instant, config: providerConfig }}
      theme={theme}
    >
      <Components />
    </Integration>
  );
};
