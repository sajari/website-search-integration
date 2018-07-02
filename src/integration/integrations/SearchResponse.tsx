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

    let tabs = null;
    if (config.tabFilters && tabsFilter) {
      const tabsFacetMap = config.tabFilters.tabs.map(
        (t: { title: string }) => ({
          display: t.title,
          name: t.title
        })
      );
      tabs = <Tabs tabs={tabsFacetMap} filter={tabsFilter} />;
    }

    // @ts-ignore: idx
    const showImages = idx(config, _ => _.results.showImages) as
      | boolean
      | undefined;

    return (
      <Response>
        <div
          className={cx(
            "sj-pipeline-response",
            css({ display: "flex", flexDirection: "column", height: "100%" })
          )}
        >
          {tabs}
          <Summary />
          <Results
            showImages={showImages}
            styles={{ container: { overflow: "scroll" } }}
          />
          <Paginator />
        </div>
      </Response>
    );
  }
}
