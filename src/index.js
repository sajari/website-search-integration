import React from "react";
import ReactDOM from "react-dom";

import PubSub from "pubsub-js";

import { flush } from "stackqueue";

import {
  selectionUpdatedEvent,
  Filter,
  CombineFilters,
  Values,
  valuesUpdatedEvent,
  Pipeline,
  responseUpdatedEvent,
  searchSentEvent,
  pageClosedAnalyticsEvent,
  bodyResetAnalyticsEvent,
  resultClickedAnalyticsEvent
} from "sajari-react/controllers";

import loaded from "./loaded";
import Overlay from "./Overlay";
import InPage from "./InPage";
import SearchResponse from "./SearchResponse";
import ContentBlockResponse from "./ContentBlockResponse";
import StandaloneInput from "./StandaloneInput";

import "./styles.css";

const ESCAPE_KEY_CODE = 27;

const integrationEvents = {
  // Events to publish
  searchSent: "search-sent",
  valuesUpdated: "values-updated",
  responseUpdated: "response-updated",
  pageClosed: "page-closed",
  queryReset: "query-reset",
  resultClicked: "result-clicked",
  searchEvent: "search-event",
  autocompleteSelected: "autocomplete-selected",

  // Events to both publish and subscribe
  overlayShow: "overlay-show",
  overlayHide: "overlay-hide",

  // Events to subscribe
  valuesSet: "values-set",
  searchSend: "search-send"
};

let disableTabFacetSearch = false;

const error = message => {
  if (console && console.error) {
    console.error(message);
  }
};

const checkConfig = (config, checkPipeline = true) => {
  if (!config.project) {
    throw new Error("'project' not set in config");
  }
  if (!config.collection) {
    throw new Error("'collection' not set in config");
  }
  if (checkPipeline && !config.pipeline) {
    throw new Error("'pipeline' not set in config");
  }
};

const initOverlay = (config, pipeline, values, pub, sub, tabsFilter) => {
  const setOverlayControls = controls => {
    const show = () => {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
      controls.show();
    };
    const hide = () => {
      document.getElementsByTagName("body")[0].style.overflow = "";
      values.set({ q: undefined, "q.override": undefined });
      pipeline.clearResponse(values.get());
      if (config.tabFilters && config.tabFilters.defaultTab) {
        disableTabFacetSearch = true;
        tabsFilter.set(config.tabFilters.defaultTab);
        disableTabFacetSearch = false;
      }
      controls.hide();
    };
    sub(integrationEvents.overlayShow, show);
    sub(integrationEvents.overlayHide, hide);
    return { show, hide };
  };

  // Create a container to render the overlay into
  const overlayContainer = document.createElement("div");
  overlayContainer.id = "sj-overlay-holder";
  document.body.appendChild(overlayContainer);

  // Set up global overlay values
  document.addEventListener("keydown", e => {
    if (e.keyCode === ESCAPE_KEY_CODE) {
      pub(integrationEvents.overlayHide);
    }
  });

  ReactDOM.render(
    <Overlay
      config={config}
      setOverlayControls={setOverlayControls}
      tabsFilter={tabsFilter}
      pipeline={pipeline}
      values={values}
    />,
    overlayContainer
  );
};

const initInPage = (config, pipeline, values, tabsFilter) => {
  ReactDOM.render(
    <InPage config={config} pipeline={pipeline} values={values} />,
    config.attachSearchBox
  );
  ReactDOM.render(
    <SearchResponse
      config={config}
      tabsFilter={tabsFilter}
      pipeline={pipeline}
      values={values}
    />,
    config.attachSearchResponse
  );
};

const initContentBlock = (config, pipeline, values, tabsFilter) => {
  ReactDOM.render(
    <ContentBlockResponse
      config={config}
      tabsFilter={tabsFilter}
      pipeline={pipeline}
      values={values}
    />,
    config.attachContentBlock
  );
};

const initStandaloneInput = (config, pubAutocompleteSelected) => {
  ReactDOM.render(
    <StandaloneInput
      config={config}
      pubAutocompleteSelected={pubAutocompleteSelected}
    />,
    config.attachStandaloneInput
  );
};

const initInterface = (config, pub, sub) => {
  if (config.attachStandaloneInput) {
    checkConfig(config, false);
    const pubAutocompleteSelected = query => {
      pub(integrationEvents.autocompleteSelected, query);
    };
    initStandaloneInput(config, pubAutocompleteSelected);
    return;
  }

  checkConfig(config);

  const pipeline = new Pipeline(
    config.project,
    config.collection,
    config.pipeline,
    undefined,
    config.disableGA ? [] : undefined
  );

  pipeline.listen(searchSentEvent, values => {
    pub(integrationEvents.searchSent, values);
  });
  pipeline.listen(responseUpdatedEvent, response => {
    pub(integrationEvents.responseUpdated, response);
  });

  const values = new Values();
  values.listen(valuesUpdatedEvent, (changes, set) => {
    if (!changes.page && values.get().page !== "1") {
      set({ page: "1" });
    }
  });

  values.listen(valuesUpdatedEvent, (changes, set) => {
    pub(integrationEvents.valuesUpdated, changes, set);
  });

  sub(integrationEvents.valuesSet, (_, newValues) => {
    values.set(newValues);
  });

  sub(integrationEvents.searchSend, () => {
    pipeline.search(values.get());
  });

  const analytics = pipeline.getAnalytics();
  analytics.listen(pageClosedAnalyticsEvent, body => {
    pub(integrationEvents.pageClosed, body);
    pub(integrationEvents.searchEvent, body);
  });
  analytics.listen(bodyResetAnalyticsEvent, body => {
    pub(integrationEvents.queryReset, body);
    pub(integrationEvents.searchEvent, body);
  });
  analytics.listen(resultClickedAnalyticsEvent, body => {
    pub(integrationEvents.resultClicked, body);
    pub(integrationEvents.searchEvent, body);
  });

  let tabsFilter;
  if (config.tabFilters && config.tabFilters.defaultTab) {
    const opts = {};
    config.tabFilters.tabs.forEach(t => {
      opts[t.title] = t.filter;
    });
    tabsFilter = new Filter(opts, [config.tabFilters.defaultTab]);
    tabsFilter.listen(selectionUpdatedEvent, () => {
      // Perform a search when the tabs change
      if (!disableTabFacetSearch) {
        values.emitUpdated();
        pipeline.search(values.get());
      }
    });

    values.listen(valuesUpdatedEvent, changes => {
      // If the query is empty, reset the tab back to the default if it's not already
      if (
        !values.get().q &&
        tabsFilter.get() !== config.tabFilters.defaultTab
      ) {
        disableTabFacetSearch = true;
        tabsFilter.set(config.tabFilters.defaultTab);
        disableTabFacetSearch = false;
      }
    });
  }

  let initialFilter;
  if (config.values.filter) {
    initialFilter = new Filter(
      {
        initialFilter: config.values.filter
      },
      "initialFilter"
    );
    delete config.values.filter;
  }
  values.set(config.values);

  const filter = new CombineFilters(
    [tabsFilter, initialFilter].filter(Boolean)
  );
  values.set({ filter: () => filter.filter() });

  const query = Boolean(config.values.q);
  if (query) {
    pipeline.search(values.get());
  }

  if (config.overlay) {
    initOverlay(config, pipeline, values, pub, sub, tabsFilter);
    if (query) {
      pub(integrationEvents.overlayShow);
    }
    return;
  }
  if (config.attachSearchBox && config.attachSearchResponse) {
    initInPage(config, pipeline, values, tabsFilter);
    return;
  }
  if (config.attachContentBlock) {
    initContentBlock(config, pipeline, values, tabsFilter);
    return;
  }
  error("no render mode found, need to specify an attachment style");
};

const initialise = () => {
  if (!window.sajari) {
    throw new Error("window.sajari not found, needed for website-search");
  }
  if (!window.sajari.ui) {
    throw new Error("window.sajari.ui not found, needed for website-search");
  }

  window.sajari.ui.forEach((s, i) => {
    const pub = (event, data) => PubSub.publish(`${i}.${event}`, data);
    const sub = (event, fn) => {
      if (event === "*") {
        PubSub.subscribe(`${i}`, fn);
        return;
      }
      PubSub.subscribe(`${i}.${event}`, fn);
    };

    let configured = false;
    const config = config => {
      if (configured) {
        throw new Error("website search interface can only be configured once");
      }
      if (!config) {
        throw new Error("no config provided");
      }
      initInterface(config, pub, sub);
      configured = true;
    };

    const methods = { config, pub, sub };

    const errors = flush(s, methods);
    if (errors.length > 0) {
      errors.forEach(error);
    }
  });
};

loaded(window, initialise);
