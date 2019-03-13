import * as React from "react";
import get from "dlv";
import { PubSub, Pipelines } from "./wsi";
import { Portal, getRenderTargets } from "./wsi/utils";
import { connectURLParamUpdate } from "./wsi/connectors";
import { Config } from "./conf";

import IntegrationContainer from "./components/integrationContainer";
import Input from "./components/input";
import SearchResponse from "./components/searchResponse";

export default function inlineIntegration(
  config: Config,
  pubsub: PubSub,
  pipelines: Pipelines
) {
  console.log(config);

  const [t1, t2] = getRenderTargets(config, [
    "render.targets.searchBox",
    "render.targets.searchResponse"
  ]);

  if (get(config, "integration.updateURLQueryParam", true)) {
    connectURLParamUpdate(config, pipelines.search.pipeline);
  }

  const defaultValue = getDefaultQueryValue(config);
  if (defaultValue !== "") {
    pipelines.search.pipeline.search(pipelines.search.values.get());
  }

  return function InlineIntegration() {
    return (
      <IntegrationContainer pipelines={pipelines}>
        <Portal element={t1}>
          <Input config={config} defaultValue={defaultValue} />
        </Portal>
        <Portal element={t2}>
          <SearchResponse config={config} pipelines={pipelines} />
        </Portal>
      </IntegrationContainer>
    );
  };
}

function getDefaultQueryValue(config: Pick<Config, "values">): string {
  return get(config, `values.${get(config, "search.config.qParam", "q")}`, "");
}
