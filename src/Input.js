import React from "react";

import { Pipeline, Values, NoTracking } from "sajari-react/controllers";

import {
  AutocompleteDropdownBase,
  AutocompleteInput
} from "sajari-react/ui/text";

const instant = "instant";

class Input extends React.Component {
  constructor(props) {
    super(props);
    const autocompletePipeline = new Pipeline(
      props.config.project,
      props.config.collection,
      props.config.searchInput.pipeline || "autocomplete",
      new NoTracking()
    );
    const autocompleteValues = new Values();
    // mirror the autocomplete starting query with the other values object
    if (props.mode !== instant && props.values && props.values.get().q) {
      autocompleteValues.set({ q: props.values.get().q });
    }
    let pipelineToSearch = autocompletePipeline;
    let valuesToSearch = autocompleteValues;
    if (props.config.attachSearchResponse || props.config.overlay) {
      pipelineToSearch = props.pipeline;
      valuesToSearch = props.values;
    }
    this.state = {
      autocompletePipeline,
      autocompleteValues,
      pipelineToSearch,
      valuesToSearch
    };
  }

  handleUserForceSearch = query => {
    const { pubSuggestionChosen } = this.props;
    const { valuesToSearch, pipelineToSearch } = this.state;
    if (query) {
      pubSuggestionChosen(query);
    }
    return { values: valuesToSearch, pipeline: pipelineToSearch };
  };

  render() {
    const { autocompletePipeline, autocompleteValues } = this.state;
    const { config, values, pipeline } = this.props;
    const { autoFocus, placeholder, mode, maxSuggestions } = config.searchInput;

    if (mode === instant) {
      return (
        <AutocompleteInput
          autoFocus={autoFocus}
          placeholder={placeholder}
          pipeline={pipeline}
          values={values}
        />
      );
    }

    return (
      <AutocompleteDropdownBase
        autoFocus={autoFocus}
        placeholder={placeholder}
        values={autocompleteValues}
        pipeline={autocompletePipeline}
        onForceSearch={this.handleUserForceSearch}
        maxSuggestions={maxSuggestions}
      />
    );
  }
}

export default Input;
