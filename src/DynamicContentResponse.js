import React from "react";

import { Results, Result, ImageResult } from "sajari-react/ui/results";

const DynamicContentResponse = props => {
  const { config, pipeline } = props;
  const resultsConfig = config.results || {};
  const resultRenderer = resultsConfig.showImages ? ImageResult : Result;
  return (
    <div className="sj-pipeline-response sj-dynamic-content-response">
      <Results ResultRenderer={resultRenderer} pipeline={pipeline} />
    </div>
  );
};

export default DynamicContentResponse;
