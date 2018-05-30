import idx from "idx";
import * as React from "react";

// @ts-ignore: module missing defintions file
import { Results } from "sajari-react";

import { IntegrationConfig } from "../../config";

export interface DynamicContentResponseProps {
  config: IntegrationConfig;
}

export const DynamicContentResponse: React.SFC<
  DynamicContentResponseProps
> = props => {
  const { config } = props;

  // @ts-ignore: idx
  const showImages = idx(config, _ => _.results.showImages);

  return (
    <div className="sj-pipeline-response sj-dynamic-content-response">
      <Results showImages={showImages} />
    </div>
  );
};
