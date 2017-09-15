import React from "react";

import Input from "./Input";

class InPage extends React.Component {
  render() {
    const { pipeline, values, config, pubSuggestionChosen } = this.props;
    return (
      <div className="sj-inpage">
        <div className="sj-logo" />
        <Input
          values={values}
          pipeline={pipeline}
          config={config}
          pubSuggestionChosen={pubSuggestionChosen}
        />
      </div>
    );
  }
}

export default InPage;
