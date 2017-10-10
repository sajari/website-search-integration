import React from "react";

import {
  AutocompleteDropdownBase,
  Input as SDKInput
} from "sajari-react/ui/text";

class Input extends React.Component {
  handleUserForceSearch = query => {
    const { pipeline, values, instantPipeline, instantValues } = this.props;
    return {
      values: values || instantValues,
      pipeline: pipeline || instantPipeline
    };
  };

  render() {
    const {
      config,
      pipeline,
      values,
      instantPipeline,
      instantValues
    } = this.props;
    const { inputPlaceholder, inputAutoFocus, maxSuggestions } = config;

    // if there's no instant pipeline use non instant input component
    if (!instantPipeline) {
      return (
        <div className="sj-search-holder-outer">
          <div className="sj-search-holder-inner">
            <SDKInput
              autoFocus={inputAutoFocus}
              placeholder={inputPlaceholder}
              values={values}
              pipeline={pipeline}
              instant={false}
              className="sj-search-bar-input-common"
            />
          </div>
        </div>
      );
    }

    return (
      <AutocompleteDropdownBase
        autoFocus={inputAutoFocus}
        placeholder={inputPlaceholder}
        values={instantValues}
        pipeline={instantPipeline}
        onForceSearch={this.handleUserForceSearch}
        maxSuggestions={maxSuggestions}
      />
    );
  }
}

export default Input;
