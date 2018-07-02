import {
  ClickTracking,
  GoogleAnalytics,
  NoTracking,
  Pipeline,
  Values
} from "@sajari/sdk-react";

import { IntegrationConfig } from "../../config";
import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "../constants";

export interface PipelineConfig {
  name: string;
  tracking: NoTracking | ClickTracking;
  analytics: GoogleAnalytics | any[] | undefined;
}

export interface InitializePipelinesConfig {
  project: string;
  collection: string;
  search?: PipelineConfig;
  instant?: PipelineConfig;
}

const trackingFromConfig = (
  config: IntegrationConfig
): NoTracking | ClickTracking => {
  switch (config.tracking) {
    case undefined:
    case "none":
      return new NoTracking();
    case "click":
      return new ClickTracking("url", config.urlQueryParam);
  }
};

export const createPipelineConfigs = (config: IntegrationConfig) => {
  const { mode } = config;

  let search: PipelineConfig | undefined;
  let instant: PipelineConfig | undefined;

  switch (mode) {
    case INTEGRATION_TYPE_SEARCH_BOX:
      search = {
        analytics: [],
        name: "",
        tracking: new NoTracking()
      };

      if (config.instantPipeline === undefined) {
        throw new Error(
          `instantPipeline must be defined for ${INTEGRATION_TYPE_SEARCH_BOX} integrations`
        );
      }

      instant = {
        analytics: [],
        name: config.instantPipeline,
        tracking: new NoTracking()
      };
      break;

    case INTEGRATION_TYPE_INLINE:
    case INTEGRATION_TYPE_OVERLAY:
    case INTEGRATION_TYPE_DYNAMIC_CONTENT:
      if (config.pipeline !== undefined) {
        search = {
          analytics: config.disableGA ? [] : undefined,
          name: config.pipeline,
          tracking: trackingFromConfig(config)
        };
      }

      // dynamic content never uses an instant pipeline
      if (mode === INTEGRATION_TYPE_DYNAMIC_CONTENT) {
        break;
      }

      if (config.instantPipeline !== undefined) {
        instant = {
          analytics: config.disableGA || search ? [] : undefined,
          name: config.instantPipeline,
          tracking: search ? new NoTracking() : trackingFromConfig(config)
        };
      }
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
        project,
        collection
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
        project,
        collection
      },
      name,
      tracking,
      // @ts-ignore: not actually sure why this doesn't like this type def
      analytics
    );
    instantValues = new Values();
  }

  return {
    instant:
      instant && instantPipeline && instantValues
        ? {
            pipeline: instantPipeline,
            values: instantValues
          }
        : undefined,
    search:
      search && searchPipeline && searchValues
        ? {
            pipeline: searchPipeline,
            values: searchValues
          }
        : undefined
  };
};
