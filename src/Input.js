import React from "react";

import {
  AutocompleteDropdownBase,
  Input as SDKInput
} from "sajari-react/ui/text";

class Input extends React.Component {
  handleUserForceSearch = query => {
    const { pipeline, values } = this.props;
    return { values, pipeline };
  };

  render() {
    const {
      config,
      pipeline,
      values,
      instantPipeline,
      instantValues
    } = this.props;
    const {
      searchInputPlaceholder,
      searchInputAutoFocus,
      maxSuggestions
    } = config;

    // if there's no instant pipeline use non instant input component
    if (!instantPipeline) {
      return (
        <div className="sj-search-holder-outer">
          <div className="sj-search-holder-inner">
            <SDKInput
              autoFocus={searchInputAutoFocus}
              placeholder={searchInputPlaceholder}
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
        autoFocus={searchInputAutoFocus}
        placeholder={searchInputPlaceholder}
        values={instantValues}
        pipeline={instantPipeline}
        onForceSearch={this.handleUserForceSearch}
        maxSuggestions={maxSuggestions}
      />
    );
  }
}

export default Input;
