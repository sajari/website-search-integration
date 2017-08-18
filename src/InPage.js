import React from "react";

import { AutocompleteInput } from "sajari-react/ui/text";

class InPage extends React.Component {
  render() {
    const { pipeline, values, config } = this.props;
    return (
      <div className="sj-inpage">
        <div className="sj-logo" />
        <AutocompleteInput
          values={values}
          pipeline={pipeline}
          placeholder={config.searchBoxPlaceHolder}
        />
      </div>
    );
  }
}

export default InPage;
