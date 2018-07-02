import { Results } from "@sajari/sdk-react";
import idx from "idx";
import * as React from "react";

import { IntegrationConfig } from "../../config";

export interface DynamicContentResponseProps {
  config: IntegrationConfig;
}

export const DynamicContentResponse: React.SFC<
  DynamicContentResponseProps
> = props => {
  const { config } = props;

  // @ts-ignore: idx
  const resultsStyles = idx(config, _ => _.styling.components.results) as
    | { [k: string]: any }
    | undefined;

  // @ts-ignore: idx
  const showImages = idx(config, _ => _.results.showImages) as
    | boolean
    | undefined;

  return (
    <div className="sj-pipeline-response sj-dynamic-content-response">
      <Results showImages={showImages} styles={resultsStyles} />
    </div>
  );
};
