import get from "dlv";
import {
  Pipeline,
  Values,
  Filter,
  CombineFilters,
  EVENT_SELECTION_UPDATED,
  EVENT_SEARCH_SENT
} from "@sajari/sdk-react";
import { updateQueryStringParam } from "./utils";

// connectFilterToValues creates single filter and attaches it to the values object.
// It will pull the default filter from the config if present.
export function connectFilterToValues(
  config: any,
  pipeline: Pipeline,
  values: Values,
  filters: Filter[] = []
) {
  let defaultFilter = get(config, "values.filter", null);
  let filter = undefined;
  if (defaultFilter !== null) {
    filter = new Filter({ defaultFilter }, ["defaultFilter"]);
    delete config.values.filter;
  }

  const allFilters = CombineFilters(
    [filter, ...filters].filter(x => !!x) as Filter[],
    "AND"
  );
  values.set({ filter: () => allFilters.filter() });
  allFilters.listen(EVENT_SELECTION_UPDATED, () =>
    pipeline.search(values.get())
  );
}

export function connectURLParamUpdate(config: any, pipeline: Pipeline) {
  pipeline.listen(EVENT_SEARCH_SENT, (values: { [k: string]: string }) => {
    updateQueryStringParam(
      get(config, "integration.urlQueryParam", "q"),
      get(values, get(config, "search.config.qParam", "q"))
    );
  });
}
