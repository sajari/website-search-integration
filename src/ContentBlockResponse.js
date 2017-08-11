import React from "react";

import { Results, Result, TokenLink } from "sajari-react/ui/results";
import { responseUpdatedEvent } from "sajari-react/controllers";

class ContentBlockResult extends React.Component {
  render() {
    const { values, token } = this.props;
    return (
      <div className="sj-content-block-result">
        <TokenLink token={token} url={values.url}>
          <img className="sj-image" src={values.image} alt={values.title} />
          <p className="sj-image-text">
            {values.title}
          </p>
        </TokenLink>
      </div>
    );
  }
}

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

    if (response.isEmpty()) {
      return null;
    }

    const resultsConfig = config.results || {};
    const resultRenderer = resultsConfig.showImages
      ? ContentBlockResult
      : Result;
    return (
      <div className="sj-pipeline-response">
        <Results
          ResultRenderer={resultRenderer}
          values={values}
          pipeline={pipeline}
        />
        <div style={{ clear: "both" }} />
      </div>
    );
  }
}

export default ContentBlockResponse;
