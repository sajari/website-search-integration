import React from "react";

import { Pipeline, Values } from "sajari-react/controllers";

import { AutocompleteDropdownStandalone } from "sajari-react/ui/text";

class StandaloneInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autocompletePipeline: new Pipeline(
        props.config.project,
        props.config.collection,
        props.config.searchInput.pipeline || "autocomplete"
      ),
      autocompleteValues: new Values()
    };
  }

  onUserForce = query => {
    const { pubAutocompleteSelected } = this.props;
    pubAutocompleteSelected(query);
  };

  render() {
    const { autocompletePipeline, autocompleteValues } = this.state;
    const { config } = this.props;
    const { autoFocus, placeholder } = config.searchInput;

    return (
      <AutocompleteDropdownStandalone
        autoFocus={autoFocus}
        placeholder={placeholder}
        values={autocompleteValues}
        pipeline={autocompletePipeline}
        onUserForce={this.onUserForce}
      />
    );
  }
}

export default StandaloneInput;
