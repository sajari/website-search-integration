import React from "react";

import { AutocompleteInput } from "sajari-react/ui/text";

class InPage extends React.Component {
  render() {
    const { pipeline, values } = this.props;
    return <AutocompleteInput values={values} pipeline={pipeline} />;
  }
}

export default InPage;
