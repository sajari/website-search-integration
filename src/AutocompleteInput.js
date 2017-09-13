import React from "react";

import { Pipeline, Values } from "sajari-react/controllers";

import {
  AutocompleteDropdown,
  AutocompleteInput as SDKAutocompleteInput
} from "sajari-react/ui/text";

class AutocompleteInput extends React.Component {
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
    if (props.mode !== "instant" && props.values.get().q) {
      this.state.autocompleteValues.set({ q: props.values.get().q });
    }
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
        <SDKAutocompleteInput
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

export default AutocompleteInput;
