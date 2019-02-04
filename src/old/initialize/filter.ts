import {
  CombineFilters,
  EVENT_SELECTION_UPDATED,
  EVENT_VALUES_UPDATED,
  Filter,
  Pipeline,
  Values
} from "@sajari/sdk-react";
import get from "dlv";

import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_SEARCH_BOX
} from "../constants";

window.SJ_TAB_FACET_SEARCH_DISABLED = false;

export const withSearchDisabled = (fn: () => void): void => {
  window.SJ_TAB_FACET_SEARCH_DISABLED = true;
  fn();
  window.SJ_TAB_FACET_SEARCH_DISABLED = false;
};

export const setUpTabsFilters = (
  config: { [k: string]: any },
  search: { pipeline: Pipeline; values: Values; config: { [k: string]: any } }
) => {
  const { mode } = config;
  const { pipeline, values, config: searchConfig } = search;

  if (
    mode === INTEGRATION_TYPE_SEARCH_BOX ||
    mode === INTEGRATION_TYPE_DYNAMIC_CONTENT
  ) {
    return undefined;
  }

  let tabsFilter: Filter | undefined;
  const configDefaultTab = get(
    config,
    "integration.tabFilters.defaultTab",
    undefined
  );

  if (configDefaultTab) {
    const opts: { [k: string]: string } = {};
    get(config, "integration.tabFilters.tabs").forEach(
      (t: { filter: string; title: string }) => {
        opts[t.title] = t.filter;
      }
    );
    tabsFilter = new Filter(opts, [configDefaultTab]);
    tabsFilter.listen(EVENT_SELECTION_UPDATED, () => {
      // Perform a search when the tabs change
      if (!window.SJ_TAB_FACET_SEARCH_DISABLED) {
        // @ts-ignore: internal use
        values._emitUpdated();
        pipeline.search(values.get());
      }
    });

    values.listen(EVENT_VALUES_UPDATED, (_: any) => {
      // If the query is empty, reset the tab back to the default if it's not already
      if (
        !values.get()[searchConfig.qParam] &&
        tabsFilter !== undefined &&
        tabsFilter.get() !== configDefaultTab
      ) {
        // @ts-ignore: tabsFilter undefined check above
        withSearchDisabled(() => tabsFilter.set(configDefaultTab, true));
      }
    });
  }

  let initialFilter;
  const configInitalFilter = get(config, "values.filter", false);
  if (configInitalFilter) {
    initialFilter = new Filter(
      { initialFilter: configInitalFilter },
      "initialFilter"
    );
    delete config.values.filter;
  }
  values.set(config.values || {});

  const filter = CombineFilters([tabsFilter, initialFilter].filter(
    x => !!x
  ) as Filter[]);
  values.set({ filter: () => filter.filter() });

  return tabsFilter;
};
