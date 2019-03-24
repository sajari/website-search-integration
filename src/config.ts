export type InputMode = "standard" | "typeahead" | "suggestions";

export type TrackingMode = "none" | "click";

export interface IntegrationConfig {
  mode: string;
  project: string;
  collection: string;
  pipeline?: string;
  instantPipeline?: string;
  maxSuggestions?: number;

  inputMode?: InputMode; // if set to "typehead", the instantSearch prop is added to the input
  inputPlaceholder?: string;
  inputAutoFocus?: boolean;
  inputSearchButtonText?: string;
  inputVoiceToText?: boolean;

  urlQueryParam?: string;
  searchOnLoad?: boolean;

  attachSearchBox: Element;
  attachSearchResponse: Element;
  attachDynamicContent: Element;

  disableGA?: boolean;
  tracking?: TrackingMode;

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

  forceLang?: string;
  localization?: {
    [lang: string]: {
      summary?: {
        page?: string;
        resultsFor?: string;
        searchInstead?: string;
      };
      errors?: {
        authorization?: string;
        connection?: string;
        parseResponse?: string;
      };
    };
  };

  styling?: {
    theme?: {
      layout?: {
        type?: "list" | "grid";
      };
      colors?: {
        brand?: {
          primary?: string;
        };
      };
    };

    components?: {
      input?: {
        container?: React.CSSProperties;
        input?: {
          container?: React.CSSProperties;
          input?: React.CSSProperties;
          typeahead?: React.CSSProperties;
          button?: React.CSSProperties;
        };
      };
      results?: {
        container?: React.CSSProperties;
        item?: React.CSSProperties;
        result?: {
          container?: React.CSSProperties;
          title?: React.CSSProperties;
          description?: React.CSSProperties;
          url?: React.CSSProperties;
        };
      };
      tabs?: {
        container?: React.CSSProperties;
        tab?: React.CSSProperties;
      };
      summary?: {
        container?: React.CSSProperties;
        override?: {
          container?: React.CSSProperties;
        };
      };
      paginator?: {
        container?: React.CSSProperties;
        controls?: React.CSSProperties;
        number?: React.CSSProperties;
      };
    };
  };
}

// tslint:disable:object-literal-sort-keys
export const defaultConfig = {
  pipeline: "website",
  instantPipeline: "autocomplete",

  // default inputMode to "suggestions"
  inputMode: "suggestions",
  inputAutoFocus: false,
  inputPlaceholder: "Search",

  maxSuggestions: 5,

  results: {
    showImages: false
  },
  values: {
    resultsPerPage: 10
  }
};
