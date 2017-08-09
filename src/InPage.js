import React from "react";

import { AutocompleteInput } from "sajari-react/ui/text";

import { values, pipeline } from "./resources";

class InPage extends React.Component {
  render() {
    const { config } = this.props;
    return (
      <AutocompleteInput
        values={values}
        pipeline={pipeline}
        placeholder={config.searchBoxPlaceHolder}
      />
    );
  }
}

export default InPage;
