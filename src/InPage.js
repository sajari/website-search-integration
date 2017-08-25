import React from "react";

import AutocompleteInput from "./AutocompleteInput";

class InPage extends React.Component {
  render() {
    const { pipeline, values, config } = this.props;
    return (
      <div className="sj-inpage">
        <div className="sj-logo" />
        <AutocompleteInput
          values={values}
          pipeline={pipeline}
          config={config}
        />
      </div>
    );
  }
}

export default InPage;
