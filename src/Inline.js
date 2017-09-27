import React from "react";

import Input from "./Input";

class Inline extends React.Component {
  render() {
    const {
      pipeline,
      values,
      instantPipeline,
      instantValues,
      config,
      pubSuggestionChosen
    } = this.props;
    return (
      <div className="sj-inline">
        <div className="sj-logo" />
        <Input
          instantPipeline={instantPipeline}
          instantValues={instantValues}
          pipeline={pipeline}
          values={values}
          config={config}
          pubSuggestionChosen={pubSuggestionChosen}
        />
      </div>
    );
  }
}

export default Inline;
