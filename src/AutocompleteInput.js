import React from "react";

import { Pipeline, Values } from "sajari-react/controllers";

import { AutocompleteDropdown } from "sajari-react/ui/text";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autocompletePipeline: new Pipeline(
        props.config.project,
        props.config.collection,
        props.config.autocompleteInput.pipeline || "autocomplete"
      ),
      autocompleteValues: new Values()
    };
  }

  update = query => {
    const { config, pipeline, values } = this.props;
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
    if (query) {
      values.set({ q: query, "q.override": true });
      pipeline.search(values.get());
      return;
    }
    pipeline.clearResponse(values.get());
  };

  render() {
    const { autocompletePipeline, autocompleteValues } = this.state;
    const { config, pipeline, values } = this.props;
    const {
      autoFocus,
      placeholder,
      autocomplete,
      instant,
      amount,
      submit
    } = config.input;

    const valuesForAutocomplete = instant ? values : autocompleteValues;
    const pipelineForAutocomplete = instant ? pipeline : autocompletePipeline;

    const suggestionAmount = autocomplete ? amount : 0;
    const searchAutocomplete =
      (autocomplete || instant) && !(instant && !autocomplete);
    const showCompletion = instant;
    const submitAction = submit || this.submit;

    return (
      <AutocompleteDropdown
        autoFocus={autoFocus}
        placeholder={placeholder}
        values={valuesForAutocomplete}
        pipeline={pipelineForAutocomplete}
        suggestionAmount={suggestionAmount}
        handleUpdate={this.update}
        handleSubmit={submitAction}
        search={searchAutocomplete}
        showCompletion={showCompletion}
      />
    );
  }
}

export default App;
