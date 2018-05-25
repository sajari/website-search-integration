import {
  Pipeline,
  Values,
  NoTracking,
  ClickTracking,
  GoogleAnalytics
  // @ts-ignore: module missing defintions file
} from "sajari-react";

import { IIntegrationConfig } from "../../config";

export interface IPipelineConfig {
  name: string;
  tracking: NoTracking | ClickTracking | undefined;
  analytics: GoogleAnalytics | any[] | undefined;
}

export interface IInitializePipelinesConfig {
  project: string;
  collection: string;
  search?: IPipelineConfig;
  instant?: IPipelineConfig;
}

export const createPipelineConfigs = (config: IIntegrationConfig) => {
  const { mode } = config;

  let search: IPipelineConfig | undefined = undefined;
  let instant: IPipelineConfig | undefined = undefined;

  switch (mode) {
    case "search-box":
      search = {
        name: "",
        tracking: new NoTracking(),
        analytics: []
      };

      instant = {
        name: config.instantPipeline as string,
        tracking: new NoTracking(),
        analytics: []
      };
      break;

    case "dynamic-content":
      break;

    case "inline":
    case "overlay":
      search = config.pipeline
        ? {
            name: config.pipeline as string,
            tracking: undefined,
            analytics: config.disableGA ? [] : undefined
          }
        : undefined;

      instant = config.instantPipeline
        ? {
            name: config.instantPipeline as string,
            tracking: search ? new NoTracking() : undefined,
            analytics: config.disableGA || search ? [] : undefined
          }
        : undefined;
      break;

    default:
      break;
  }

  return { search, instant };
};

export const initializePipelines = (config: IInitializePipelinesConfig) => {
  const { project, collection, search, instant } = config;

  let searchPipeline = null;
  let searchValues = null;
  let instantPipeline = null;
  let instantValues = null;

  if (search !== undefined) {
    const { name, tracking, analytics } = search;

    searchPipeline = new Pipeline(
      project,
      collection,
      name,
      tracking,
      analytics
    );
    searchValues = new Values();
  }

  if (instant !== undefined) {
    const { name, tracking, analytics } = instant;

    instantPipeline = new Pipeline(
      project,
      collection,
      name,
      tracking,
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
  };
};
