import * as React from "react";
import get from "dlv";
import {
  Filter,
  Response,
  Summary,
  Tabs,
  Results,
  Paginator
} from "@sajari/sdk-react";
import { connectFilterToValues } from "../wsi/connectors";
import { Pipelines } from "../wsi";

export default function SearchResponse({
  config,
  pipelines
}: {
  config: any;
  pipelines: Pipelines;
}) {
  let filter: Filter | undefined = undefined;
  let tabsOptions: { name: string; display: string }[] = [];

  try {
    const { filter: tabFilter, opts } = createTabFilter(config);
    filter = tabFilter;
    tabsOptions = opts;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(error);
    }
  }

  connectFilterToValues(
    config,
    pipelines.search.pipeline,
    pipelines.search.values,
    [filter].filter(x => !!x) as Filter[]
  );

  return (
    <Response>
      <Summary />
      {filter && <Tabs filter={filter} tabs={tabsOptions} />}
      <Results />
      <Paginator />
    </Response>
  );
}

function createTabFilter(
  config: any
): { filter: Filter; opts: { name: string; display: string }[] } {
  const tabFilterConfig = get(config, "integration.tabFilters", null);

  if (tabFilterConfig === null) {
    throw new Error("`integration.tabFilters` is not present.");
  }

  const tabFilters = (get(tabFilterConfig, "tabs", []) as Array<{
    title: string;
    filter: string;
  }>).reduce<{ [k: string]: string }>((tabs, { title, filter }) => {
    tabs[title] = filter;
    return tabs;
  }, {});

  const tabFilter = new Filter(
    tabFilters,
    get(tabFilterConfig, "defaultTab", [])
  );
  const tabOptions = Object.entries(tabFilters).map(([key]) => {
    return { name: key, display: key };
  });

  return { filter: tabFilter, opts: tabOptions };
}
