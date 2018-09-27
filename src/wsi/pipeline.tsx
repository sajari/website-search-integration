import { ClickTracking, NoTracking, Pipeline, Values } from "@sajari/sdk-react";
import merge from "deepmerge";
import get from "dlv";
import { PubSub } from "./pubsub";

export function createPipelinesAndValues(
  config: any,
  pubsub: PubSub
): {
  search: { pipeline: Pipeline; values: Values; config: any };
  instant: { pipeline: Pipeline; values: Values; config: any };
} {
  const project = get(config, "project");
  const collection = get(config, "collection");
  const searchConfig = get(config, "search");
  const instantConfig = get(config, "instant");
  const tracking = get(config, "integration.tracking");
  const enableGAEvents = get(config, "integration.enableGAEvents");
  const endpoint = get(config, "endpoint", undefined);

  const search = {
    pipeline: createPipeline({
      project,
      collection,
      endpoint,
      name: searchConfig.pipeline,
      qParam: get(searchConfig, "config.qParam"),
      tracking,
      enableGAEvents
    }),
    values: createValues(get(config, "values", undefined)),
    config: get(searchConfig, "config")
  };
  pubsub.connectToPipelineAndValues(
    searchConfig.pipeline,
    search.pipeline,
    search.values
  );
  if (enableGAEvents) {
    pubsub.connectToAnalytics(
      searchConfig.pipeline,
      search.pipeline.getAnalytics()
    );
  }

  const instant = {
    pipeline: createPipeline({
      project,
      collection,
      endpoint,
      name: instantConfig.pipeline,
      tracking: "none",
      enableGAEvents
    }),
    values: createValues(),
    config: get(instantConfig, "config")
  };
  pubsub.connectToPipelineAndValues(
    instantConfig.pipeline,
    instant.pipeline,
    instant.values
  );

  return { search, instant };
}

interface CreatePipelineArgs {
  project: string;
  collection: string;
  name: string;
  tracking: "none" | "click";
  qParam?: string;
  enableGAEvents?: boolean;
  endpoint?: string;
}

function createPipeline({
  project,
  collection,
  name,
  tracking: trackingMode,
  qParam,
  enableGAEvents,
  endpoint
}: CreatePipelineArgs): Pipeline {
  const config = { project, collection } as {
    project: string;
    collection: string;
    endpoint?: string;
  };
  if (endpoint) {
    config.endpoint = endpoint;
  }

  let tracking = new NoTracking();
  if (
    process.env.NODE_ENV !== "development" &&
    trackingMode === "click" &&
    qParam
  ) {
    tracking = new ClickTracking("url", qParam);
  }

  return new Pipeline(config, name, tracking, !enableGAEvents ? [] : undefined);
}

function createValues(defaults?: { [k: string]: string }): Values {
  return new Values(
    merge(
      {
        fields: ["title", "description", "url", "image"]
      },
      defaults || {}
    )
  );
}
