import {
  CombineFilters,
  EVENT_SELECTION_UPDATED,
  EVENT_VALUES_UPDATED,
  Filter,
  Pipeline,
  Values
  // @ts-ignore: module missing defintions file
} from "sajari-react";
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
    const opts: { [k: string]: Filter } = {};
    config.tabFilters.tabs.forEach(t => {
      opts[t.title] = t.filter;
    });
    tabsFilter = new Filter(opts, [config.tabFilters.defaultTab]);
    tabsFilter.listen(EVENT_SELECTION_UPDATED, () => {
      // Perform a search when the tabs change
      // @ts-ignore
      if (!window.SJ_TAB_FACET_SEARCH_DISABLED) {
        values._emitUpdated();
        pipeline.search(values.get());
      }
    });

    values.listen(EVENT_VALUES_UPDATED, (changes: { [k: string]: string }) => {
      // If the query is empty, reset the tab back to the default if it's not already
      if (
        !values.get().q &&
        tabsFilter.get() !==
          (config.tabFilters as { [k: string]: any }).defaultTab
      ) {
        // @ts-ignore
        window.SJ_TAB_FACET_SEARCH_DISABLED = true;
        tabsFilter.set((config.tabFilters as { [k: string]: any }).defaultTab);
        // @ts-ignore
        window.SJ_TAB_FACET_SEARCH_DISABLED = false;
      }
    });
  }

  let initialFilter;
  if ((config.values as { [k: string]: string | number }).filter) {
    initialFilter = new Filter(
      {
        initialFilter: (config.values as { [k: string]: string | number })
          .filter
      },
      "initialFilter"
    );
    delete (config.values as { [k: string]: string | number }).filter;
  }
  values.set(config.values);

  const filter = new CombineFilters(
    [tabsFilter, initialFilter].filter(Boolean)
  );
  values.set({ filter: () => filter.filter() });

  // Perform a search if the q parameter is set
  const query = Boolean((config.values as { [k: string]: string | number }).q);
  if (query) {
    values.set({ q: (config.values as { [k: string]: string | number }).q });
    // this might be important ;)
    // instantPipeline.getValues().set({ q: config.values.q });
    pipeline.search(values.get());
  }

  return tabsFilter;
};
