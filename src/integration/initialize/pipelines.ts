import {
  ClickTracking,
  GoogleAnalytics,
  NoTracking,
  Pipeline,
  Values
} from "@sajari/sdk-react";

import { IntegrationConfig } from "../../config";

export interface PipelineConfig {
  name: string;
  tracking: NoTracking | ClickTracking | undefined;
  analytics: GoogleAnalytics | any[] | undefined;
}

export interface InitializePipelinesConfig {
  project: string;
  collection: string;
  search?: PipelineConfig;
  instant?: PipelineConfig;
}

export const createPipelineConfigs = (config: IntegrationConfig) => {
  const { mode } = config;

  let search: PipelineConfig | undefined;
  let instant: PipelineConfig | undefined;

  switch (mode) {
    case "search-box":
      search = {
        name: "",
        tracking: new NoTracking(),
        analytics: []
      } as PipelineConfig;

      instant = {
        name: config.instantPipeline as string,
        tracking: new NoTracking(),
        analytics: []
      } as PipelineConfig;
      break;

    case "dynamic-content":
      search = config.pipeline
        ? ({
            name: config.pipeline as string,
            tracking: undefined,
            analytics: config.disableGA ? [] : undefined
          } as PipelineConfig)
        : undefined;
      break;

    case "inline":
    case "overlay":
      search = config.pipeline
        ? ({
            name: config.pipeline as string,
            tracking: undefined,
            analytics: config.disableGA ? [] : undefined
          } as PipelineConfig)
        : undefined;

      instant = config.instantPipeline
        ? ({
            name: config.instantPipeline as string,
            tracking: search ? new NoTracking() : undefined,
            analytics: config.disableGA || search ? [] : undefined
          } as PipelineConfig)
        : undefined;
      break;

    default:
      break;
  }

  return { search, instant };
};

export const initializePipelines = (config: InitializePipelinesConfig) => {
  const { project, collection, search, instant } = config;

  let searchPipeline = null;
  let searchValues = null;
  let instantPipeline = null;
  let instantValues = null;

  if (search !== undefined) {
    const { name, tracking, analytics } = search;

    searchPipeline = new Pipeline(
      {
        collection,
        project
      },
      name,
      tracking,
      // @ts-ignore: not actually sure why this doesn't like this type def
      analytics
    );
    searchValues = new Values();
  }

  if (instant !== undefined) {
    const { name, tracking, analytics } = instant;

    instantPipeline = new Pipeline(
      {
        collection,
        project
      },
      name,
      tracking,
      // @ts-ignore: not actually sure why this doesn't like this type def
      analytics
    );
    instantValues = new Values();
  }

  return {
    search:
      search !== undefined
        ? {
            pipeline: searchPipeline as Pipeline,
            values: searchValues as Values
          }
        : undefined,
    instant:
      instant !== undefined
        ? {
            pipeline: instantPipeline as Pipeline,
            values: instantValues as Values
          }
        : undefined
  } as {
    search?: { pipeline: Pipeline; values: Values };
    instant?: { pipeline: Pipeline; values: Values };
  };
};
