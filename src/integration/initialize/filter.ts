import {
  CombineFilters,
  EVENT_SELECTION_UPDATED,
  EVENT_VALUES_UPDATED,
  Filter,
  Pipeline,
  Values
} from "@sajari/sdk-react";
import { ValuesObject } from "@sajari/sdk-react/dist/controllers/values";
import { IntegrationConfig } from "../../config";

// @ts-ignore
window.SJ_TAB_FACET_SEARCH_DISABLED = false;

export const setUpTabsFilters = (
  config: IntegrationConfig,
  pipeline: Pipeline,
  values: Values
) => {
  const { mode } = config;

  if (mode === "search-box" || mode === "dynamic-content") {
    return undefined;
  }

  let tabsFilter: Filter | undefined;

  if (config.tabFilters && config.tabFilters.defaultTab) {
    const opts: { [k: string]: string } = {};
    config.tabFilters.tabs.forEach(t => {
      opts[t.title] = t.filter;
    });
    tabsFilter = new Filter(opts, [config.tabFilters.defaultTab]);
    tabsFilter.listen(EVENT_SELECTION_UPDATED, () => {
      // Perform a search when the tabs change
      // @ts-ignore
      if (!window.SJ_TAB_FACET_SEARCH_DISABLED) {
        // @ts-ignore: internal use
        values._emitUpdated();
        pipeline.search(values.get());
      }
    });

    values.listen(EVENT_VALUES_UPDATED, (changes: ValuesObject) => {
      // If the query is empty, reset the tab back to the default if it's not already
      if (
        !values.get().q &&
        tabsFilter !== undefined &&
        tabsFilter.get() !==
          (config.tabFilters as { [k: string]: any }).defaultTab
      ) {
        // @ts-ignore
        window.SJ_TAB_FACET_SEARCH_DISABLED = true;
        tabsFilter.set(
          (config.tabFilters as { [k: string]: any }).defaultTab,
          true
        );
        // @ts-ignore
        window.SJ_TAB_FACET_SEARCH_DISABLED = false;
      }
    });
  }

  let initialFilter;
  if ((config.values as { [k: string]: string | number }).filter) {
    initialFilter = new Filter(
      {
        initialFilter: (config.values as { [k: string]: string }).filter
      },
      "initialFilter"
    );
    delete (config.values as { [k: string]: string }).filter;
  }
  values.set(config.values || {});

  const filter = CombineFilters([tabsFilter, initialFilter].filter(
    x => !!x
  ) as Filter[]);
  values.set({ filter: () => filter.filter() });

  return tabsFilter;
};
