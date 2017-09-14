import React from "react";

import { Pipeline, Values } from "sajari-react/controllers";

import { AutocompleteDropdownBase } from "sajari-react/ui/text";

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

  onUserForceSearch = query => {
    const { pubAutocompleteSelected, values, pipeline } = this.props;
    pubAutocompleteSelected(query);
    return { values, pipeline };
  };

  render() {
    const { autocompletePipeline, autocompleteValues } = this.state;
    const { config } = this.props;
    const { autoFocus, placeholder } = config.searchInput;

    return (
      <AutocompleteDropdownBase
        autoFocus={autoFocus}
        placeholder={placeholder}
        values={autocompleteValues}
        pipeline={autocompletePipeline}
        onForceSearch={this.onUserForceSearch}
      />
    );
  }
}

export default StandaloneInput;
