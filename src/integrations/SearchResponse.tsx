import { Filter, Paginator, Response, Summary, Tabs } from "@sajari/sdk-react";
import get from "dlv";
import merge from "deepmerge";
import isPlainObject from "is-plain-object";
import { css, cx } from "emotion";
import * as React from "react";
import { Results } from "../components/Results";
import { INTEGRATION_TYPE_OVERLAY } from "../constants";

export interface SearchResponseProps {
  config: { [k: string]: any };
  tabsFilter?: Filter;
}

export class SearchResponse extends React.Component<SearchResponseProps> {
  public render() {
    const { config, tabsFilter } = this.props;

    const tabsStyles = get(config, "styling.components.tabs", undefined);
    const summaryStyles = get(config, "styling.components.summary", undefined);

    const paginatorStyles = merge(
      {
        container:
          config.mode === INTEGRATION_TYPE_OVERLAY ? { height: 115 } : {},
        controls: {
          boxSizing: "border-box"
        } as { [k: string]: any },
        number: (): { [k: string]: any } => ({ boxSizing: "border-box" })
      },
      get(config, "styling.components.summary", {}),
      { isMergeableObject: isPlainObject }
    );

    let tabs = get(config, "integration.tabFilters.tabs", false);
    if (tabs && tabsFilter) {
      const tabsFacetMap = tabs.map((t: { title: string }) => ({
        display: t.title,
        name: t.title
      }));
      tabs = (
        <Tabs tabs={tabsFacetMap} filter={tabsFilter} styles={tabsStyles} />
      );
    }

    const className = cx(
      "sj-pipeline-response",
      css({ display: "flex", flexDirection: "column", height: "100%" })
    );

    return (
      <Response>
        <div className={className}>
          {tabs}
          <Summary styles={summaryStyles} />
          <Results config={config} />
          <Paginator styles={paginatorStyles} />
        </div>
      </Response>
    );
  }
}
