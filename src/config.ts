export interface IIntegrationConfig {
  mode: string;
  project: string;
  collection: string;
  pipeline?: string;
  instantPipeline?: string;
  maxSuggestions?: number;
  inputPlaceholder?: string;
  inputAutoFocus?: boolean;

  urlQueryParam?: string;

  attachSearchBox: Element;
  attachSearchResponse: Element;
  attachDynamicContent: Element;

  disableGA?: boolean;

  values?: {
    q: string;
    resultsPerPage: number;
    [k: string]: string | number;
  };

  results?: {
    showImages: boolean;
    [k: string]: string | boolean;
  };

  tabFilters?: {
    defaultTab: string;
    tabs: { title: string; filter: string }[];
  };
}

export const defaultConfig = {
  pipeline: "website",
  instantPipeline: "autocomplete",
  maxSuggestions: 5,
  inputPlaceholder: "Search",
  inputAutoFocus: false,

  values: {
    resultsPerPage: 10
  },

  results: {
    showImages: false
  }
};
