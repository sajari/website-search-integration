import { css, cx } from "emotion";
import idx from "idx";
import * as React from "react";

import {
  Filter,
  Paginator,
  Response,
  Results,
  Summary,
  Tabs
} from "@sajari/sdk-react";

import { IntegrationConfig } from "../../config";

export interface SearchResponseProps {
  config: IntegrationConfig;
  tabsFilter?: Filter;
}

export class SearchResponse extends React.Component<SearchResponseProps> {
  public render() {
    const { config, tabsFilter } = this.props;

    // @ts-ignore: idx
    const tabStyles = idx(config, _ => _.styling.components.tabs) as
      | { [k: string]: any }
      | undefined;

    // @ts-ignore: idx
    let resultsStyles = idx(config, _ => _.styling.components.results) as
      | { [k: string]: any }
      | undefined;

    if (resultsStyles === undefined) {
      resultsStyles = { container: { overflow: "scroll" } };
    } else {
      resultsStyles = {
        ...resultsStyles,
        container: {
          ...resultsStyles.container,
          overflow: "scroll"
        }
      };
    }

    // @ts-ignore: idx
    const summaryStyles = idx(config, _ => _.styling.components.summary) as
      | { [k: string]: any }
      | undefined;

    // @ts-ignore: idx
    const paginatorStyles = idx(config, _ => _.styling.components.summary) as
      | { [k: string]: any }
      | undefined;

    // @ts-ignore: idx
    const showImages = idx(config, _ => _.results.showImages) as
      | boolean
      | undefined;

    let tabs = null;
    if (config.tabFilters && tabsFilter) {
      const tabsFacetMap = config.tabFilters.tabs.map(
        (t: { title: string }) => ({
          display: t.title,
          name: t.title
        })
      );
      tabs = (
        <Tabs tabs={tabsFacetMap} filter={tabsFilter} styles={tabStyles} />
      );
    }

    return (
      <Response>
        <div
          className={cx(
            "sj-pipeline-response",
            css({ display: "flex", flexDirection: "column", height: "100%" })
          )}
        >
          {tabs}
          <Summary styles={summaryStyles} />
          <Results showImages={showImages} styles={resultsStyles} />
          <Paginator styles={paginatorStyles} />
        </div>
      </Response>
    );
  }
}
