export interface IntegrationConfig {
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
    tabs: Array<{ title: string; filter: string }>;
  };
}

export const defaultConfig = {
  inputAutoFocus: false,
  inputPlaceholder: "Search",
  instantPipeline: "autocomplete",
  maxSuggestions: 5,
  pipeline: "website",
  results: {
    showImages: false
  },
  values: {
    resultsPerPage: 10
  }
};
