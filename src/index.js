import React from "react";
import ReactDOM from "react-dom";

import PubSub from "pubsub-js";

import { flush } from "stackqueue";

import {
  selectionUpdatedEvent,
  Filter,
  Pipeline,
  Values,
  CombineFilters,
  NoTracking,
  valuesUpdatedEvent,
  responseUpdatedEvent,
  searchSentEvent,
  pageClosedAnalyticsEvent,
  bodyResetAnalyticsEvent,
  resultClickedAnalyticsEvent
} from "sajari-react/controllers";

import loaded from "./loaded";
import Overlay from "./Overlay";
import Inline from "./Inline";
import SearchResponse from "./SearchResponse";
import Input from "./Input";
import DynamicContentResponse from "./DynamicContentResponse";

import "./styles.css";
import { updateQueryStringParam } from "./utils";

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

const connectPubSub = (
  pub,
  sub,
  eventPrefix,
  pipeline,
  values,
  connectAnalytics = true
) => {
  pipeline.listen(searchSentEvent, values => {
    pub(`${eventPrefix}.${integrationEvents.searchSent}`, values);
  });
  pipeline.listen(responseUpdatedEvent, response => {
    pub(`${eventPrefix}.${integrationEvents.responseUpdated}`, response);
  });

  values.listen(valuesUpdatedEvent, (changes, set) => {
    pub(`${eventPrefix}.${integrationEvents.valuesUpdated}`, changes, set);
  });

  sub(`${eventPrefix}.${integrationEvents.valuesSet}`, (_, newValues) => {
    values.set(newValues);
  });

  sub(`${eventPrefix}.${integrationEvents.searchSend}`, () => {
    pipeline.search(values.get());
  });

  // Reset page on search values changed
  values.listen(valuesUpdatedEvent, (changes, set) => {
    if (!changes.page && values.get().page !== "1") {
      set({ page: "1" });
    }
  });

  if (!connectAnalytics) {
    return;
  }
  const analytics = pipeline.getAnalytics();
  analytics.listen(pageClosedAnalyticsEvent, body => {
    pub(`${eventPrefix}.${integrationEvents.pageClosed}`, body);
    pub(`${eventPrefix}.${integrationEvents.searchEvent}`, body);
  });
  analytics.listen(bodyResetAnalyticsEvent, body => {
    pub(`${eventPrefix}.${integrationEvents.queryReset}`, body);
    pub(`${eventPrefix}.${integrationEvents.searchEvent}`, body);
  });
  analytics.listen(resultClickedAnalyticsEvent, body => {
    pub(`${eventPrefix}.${integrationEvents.resultClicked}`, body);
    pub(`${eventPrefix}.${integrationEvents.searchEvent}`, body);
  });
};

const setUpTabsFilters = (config, pipeline, values) => {
  // Set up tab filters
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

  // Perform a search if the q parameter is set
  const query = Boolean(config.values.q);
  if (query) {
    values.set({ q: config.values.q });
    // this might be important ;)
    // instantPipeline.getValues().set({ q: config.values.q });
    pipeline.search(values.get());
  }

  return tabsFilter;
};

const initSearchbox = (config, pub, sub) => {
  if (!config.instantPipeline) {
    throw new Error(
      "no instantPipeline found, searchbox requires an instantPipeline"
    );
  }

  if (!config.attachSearchBox) {
    throw new Error(
      "no render target found, searchbox requires attachSearchBox to be set"
    );
  }

  const dummyPipeline = new Pipeline(
    config.project,
    config.collection,
    "",
    new NoTracking(),
    []
  );
  dummyPipeline.search = values => {
    pub(`pipeline.${integrationEvents.searchSent}`, values);
  };
  const dummyValues = new Values();
  const instantPipeline = new Pipeline(
    config.project,
    config.collection,
    config.instantPipeline,
    new NoTracking(),
    []
  );
  const instantValues = new Values();

  connectPubSub(
    pub,
    sub,
    "instantPipeline",
    instantPipeline,
    instantValues,
    false
  );

  ReactDOM.render(
    <Input
      config={config}
      instantPipeline={instantPipeline}
      instantValues={instantValues}
      pipeline={dummyPipeline}
      values={dummyValues}
    />,
    config.attachSearchBox
  );
};

const initDynamicContent = (config, pub, sub) => {
  if (!config.pipeline) {
    throw new Error(
      "no pipeline found, dynamic-content interface requires a pipeline"
    );
  }

  const [tracking, adapters] = config.tracking
    ? [undefined, config.disableGA ? [] : undefined]
    : [new NoTracking(), []];

  const pipeline = new Pipeline(
    config.project,
    config.collection,
    config.pipeline,
    tracking,
    adapters
  );
  const values = new Values();
  connectPubSub(pub, sub, "pipeline", pipeline, values);
  values.set(config.values);

  if (config.searchOnLoad) {
    pipeline.search(values.get());
  }

  ReactDOM.render(
    <DynamicContentResponse
      config={config}
      pipeline={pipeline}
      values={values}
    />,
    config.attachDynamicContent
  );
};

const initInline = (config, pub, sub) => {
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

  const pipeline = config.pipeline
    ? new Pipeline(
        config.project,
        config.collection,
        config.pipeline,
        undefined,
        config.disableGA ? [] : undefined
      )
    : null;
  const values = config.pipeline ? new Values() : null;
  const instantPipeline = config.instantPipeline
    ? new Pipeline(
        config.project,
        config.collection,
        config.instantPipeline,
        pipeline ? new NoTracking() : undefined,
        config.disableGA || pipeline ? [] : undefined
      )
    : null;
  const instantValues = config.instantPipeline ? new Values() : null;

  if (pipeline) connectPubSub(pub, sub, "pipeline", pipeline, values);
  if (instantPipeline)
    connectPubSub(pub, sub, "instantPipeline", instantPipeline, instantValues);

  const tabsFilter = setUpTabsFilters(
    config,
    pipeline || instantPipeline,
    values || instantValues
  );

  if (values && values.get().q && instantValues) {
    instantValues.set({ q: values.get().q });
  }

  pipeline.listen(searchSentEvent, values => {
    updateQueryStringParam(config.urlQueryParam || "q", values.q);
  });

  ReactDOM.render(
    <Inline
      config={config}
      instantPipeline={instantPipeline}
      instantValues={instantValues}
      pipeline={pipeline}
      values={values}
    />,
    config.attachSearchBox
  );
  ReactDOM.render(
    <SearchResponse
      config={config}
      tabsFilter={tabsFilter}
      pipeline={pipeline || instantPipeline}
      values={values || instantValues}
    />,
    config.attachSearchResponse
  );
};

const initOverlay = (config, pub, sub) => {
  if (!config.pipeline && !config.instantPipeline) {
    throw new Error(
      "no pipeline found, overlay interface requires at least 1 pipeline"
    );
  }

  const pipeline = config.pipeline
    ? new Pipeline(
        config.project,
        config.collection,
        config.pipeline,
        undefined,
        config.disableGA ? [] : undefined
      )
    : null;
  const values = config.pipeline ? new Values() : null;
  const instantPipeline = config.instantPipeline
    ? new Pipeline(
        config.project,
        config.collection,
        config.instantPipeline,
        pipeline ? new NoTracking() : undefined,
        config.disableGA || pipeline ? [] : undefined
      )
    : null;
  const instantValues = config.instantPipeline ? new Values() : null;

  if (pipeline) connectPubSub(pub, sub, "pipeline", pipeline, values);
  if (instantPipeline)
    connectPubSub(pub, sub, "instantPipeline", instantPipeline, instantValues);

  const tabsFilter = setUpTabsFilters(
    config,
    pipeline || instantPipeline,
    values || instantValues
  );

  if (values && values.get().q && instantValues) {
    instantValues.set({ q: values.get().q });
  }

  const setOverlayControls = controls => {
    const show = () => {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
      controls.show();
    };
    const hide = () => {
      document.getElementsByTagName("body")[0].style.overflow = "";
      if (pipeline) {
        values.set({ q: undefined, "q.override": undefined });
        pipeline.clearResponse(values.get());
      }
      if (instantPipeline) {
        instantValues.set({ q: undefined, "q.override": undefined });
        instantPipeline.clearResponse(instantValues.get());
      }
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

  pipeline.listen(searchSentEvent, values => {
    updateQueryStringParam(config.urlQueryParam || "q", values.q);
  });

  ReactDOM.render(
    <Overlay
      config={config}
      setOverlayControls={setOverlayControls}
      tabsFilter={tabsFilter}
      instantPipeline={instantPipeline}
      instantValues={instantValues}
      pipeline={pipeline}
      values={values}
    />,
    overlayContainer
  );

  if ((values || instantValues).get().q) {
    pub(integrationEvents.overlayShow);
  }
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

    const checkConfig = config => {
      if (!config.project) {
        throw new Error("'project' not set in config");
      }
      if (!config.collection) {
        throw new Error("'collection' not set in config");
      }
      if (!config) {
        throw new Error("no config provided");
      }
      if (configured) {
        throw new Error("website search interface can only be configured once");
      }
    };

    const createSearchbox = config => {
      checkConfig(config);
      initSearchbox(config, pub, sub);
      configured = true;
    };

    const createInline = config => {
      checkConfig(config);
      initInline(config, pub, sub);
      configured = true;
    };

    const createOverlay = config => {
      checkConfig(config);
      initOverlay(config, pub, sub);
      configured = true;
    };

    const createDynamicContent = config => {
      checkConfig(config);
      initDynamicContent(config, pub, sub);
      configured = true;
    };

    const methods = {
      pub,
      sub,
      "search-box": createSearchbox,
      inline: createInline,
      overlay: createOverlay,
      "dynamic-content": createDynamicContent
    };

    for (let i = 0; i < s.arr.length; i++) {
      if (typeof s.arr[i][0] === "object") {
        if (!s.arr[i][0].mode) {
          throw new Error("mode not found in config object");
        }
        s.arr[i] = [s.arr[i][0].mode, s.arr[i][0]];
      }
    }

    const errors = flush(s, methods);
    if (errors.length > 0) {
      errors.forEach(error);
    }
  });
};

loaded(window, initialise);
