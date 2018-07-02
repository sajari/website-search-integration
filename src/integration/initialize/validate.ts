import { IntegrationConfig } from "../../config";
import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "../constants";

export const validateConfig = (config: IntegrationConfig) => {
  if (!config) {
    throw new Error("no config provided");
  }
  if (!config.project) {
    throw new Error("'project' not set in config");
  }
  if (!config.collection) {
    throw new Error("'collection' not set in config");
  }

  const { mode } = config;
  switch (mode) {
    case INTEGRATION_TYPE_SEARCH_BOX:
      if (!config.instantPipeline) {
        throw new Error(
          "no instantPipeline found, search-box requires an instantPipeline"
        );
      }

      if (!config.attachSearchBox) {
        throw new Error(
          "no render target found, search-box requires attachSearchBox to be set"
        );
      }

      break;

    case INTEGRATION_TYPE_DYNAMIC_CONTENT:
      if (!config.pipeline) {
        throw new Error(
          "no pipeline found, dynamic-content interface requires a pipeline"
        );
      }

      break;

    case INTEGRATION_TYPE_INLINE:
      if (!config.pipeline && !config.instantPipeline) {
        throw new Error(
          "no pipeline found, inline interface requires at least 1 pipeline"
        );
      }
      if (!config.attachSearchBox) {
        throw new Error(
          "no render target found, inline interface requires attachSearchBox to be set"
        );
      }
      if (!config.attachSearchResponse) {
        throw new Error(
          "no render target found, inline interface requires attachSearchResponse to be set"
        );
      }

      break;

    case INTEGRATION_TYPE_OVERLAY:
      if (!config.pipeline && !config.instantPipeline) {
        throw new Error(
          "no pipeline found, overlay interface requires at least 1 pipeline"
        );
      }
      break;

    default:
      throw new Error(`invalid integration type: "${mode}"`);
  }
};
