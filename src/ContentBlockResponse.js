import React from "react";

import { Results, Result, ImageResult } from "sajari-react/ui/results";
import { responseUpdatedEvent } from "sajari-react/controllers";

class ContentBlockResponse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { response: props.pipeline.getResponse() };
  }

  componentDidMount() {
    this.removeResponseListener = this.props.pipeline.listen(
      responseUpdatedEvent,
      this.responseUpdated
    );
  }

  componentWillUnmount() {
    this.removeResponseListener();
  }

  responseUpdated = response => {
    this.setState({ response });
  };

  render() {
    const { config, pipeline, values } = this.props;
    const { response } = this.state;

    if (response.isError()) {
      return (
        <div className="sj-result-error">
          An error occurred while searching.
        </div>
      );
    }

    if (response.isEmpty()) {
      return null;
    }

    const resultsConfig = config.results || {};
    const resultRenderer = resultsConfig.showImages ? ImageResult : Result;
    return (
      <div className="sj-pipeline-response sj-content-block-response">
        <Results
          ResultRenderer={resultRenderer}
          values={values}
          pipeline={pipeline}
        />
      </div>
    );
  }
}

export default ContentBlockResponse;
