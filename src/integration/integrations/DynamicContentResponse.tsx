import * as React from "react";
import idx from "idx";

// @ts-ignore: module missing defintions file
import { Results } from "sajari-react";

import { IIntegrationConfig } from "../../config";

export interface IDynamicContentResponse {
  config: IIntegrationConfig;
}

export const DynamicContentResponse: React.SFC<
  IDynamicContentResponse
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
