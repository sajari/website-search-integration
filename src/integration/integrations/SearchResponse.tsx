import * as React from "react";
// @ts-ignore: module missing defintion file
import idx from "idx";

import {
  Filter,
  Response,
  Summary,
  Results,
  Paginator,
  Tabs,
  EVENT_RESPONSE_UPDATED
  // @ts-ignore: module missing defintion file
} from "sajari-react";

import { IIntegrationConfig } from "../../config";

export interface ISearchResponseProps {
  config: IIntegrationConfig;
  tabsFilter: Filter;
}

export class SearchResponse extends React.Component<ISearchResponseProps> {
  render() {
    const { config, tabsFilter } = this.props;

    let tabs = null;
    if (config.tabFilters) {
      const tabsFacetMap = config.tabFilters.tabs.map(
        (t: { title: string }) => ({
          name: t.title,
          display: t.title
        })
      );
      tabs = <Tabs tabs={tabsFacetMap} filter={tabsFilter} />;
    }

    // @ts-ignore: idx
    const showImages = idx(config, _ => _.results.showImages);

    return (
      <Response>
        <div className="sj-pipeline-response">
          {tabs}
          <Summary />
          <Results showImages={showImages} />
          <Paginator />
        </div>
      </Response>
    );
  }
}
