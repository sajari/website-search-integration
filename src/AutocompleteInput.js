import React from "react";

import { Pipeline, Values } from "sajari-react/controllers";

import { AutocompleteDropdown, AutocompleteInput } from "sajari-react/ui/text";

class App extends React.Component {
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

  update = query => {
    const { config, pipeline, values } = this.props;
    if (!pipeline || !values) {
      return;
    }
    if (config.instant && !config.autocomplete) {
      values.set({ q: query, "q.override": undefined });
      if (query) {
        pipeline.search(values.get());
        return;
      }
      pipeline.clearResponse(values.get());
      return;
    }
  };

  submit = query => {
    const { pipeline, values, pubAutocompleteSelected } = this.props;
    if (query && pubAutocompleteSelected) {
      pubAutocompleteSelected(query);
    }
    if (!pipeline || !values) {
      return;
    }
    if (query) {
      values.set({ q: query, "q.override": "true" });
      pipeline.search(values.get());
      return;
    }
    pipeline.clearResponse(values.get());
  };

  render() {
    const { autocompletePipeline, autocompleteValues } = this.state;
    const { config, pipeline, values } = this.props;
    const { autoFocus, placeholder, mode } = config.searchInput;

    if (mode === "instant") {
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
      <AutocompleteDropdown
        autoFocus={autoFocus}
        placeholder={placeholder}
        values={autocompleteValues}
        pipeline={autocompletePipeline}
        forceSearchValues={values}
        forceSearchPipeline={pipeline}
      />
    );
  }
}

export default App;
