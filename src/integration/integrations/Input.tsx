import * as React from "react";

import {
  Input as SDKInput
  // @ts-ignore: module missing defintion file
} from "sajari-react";

export interface IInputProps {
  config: { [k: string]: any };
}

export class Input extends React.Component<IInputProps> {
  render() {
    const { config } = this.props;
    const { inputPlaceholder, inputAutoFocus } = config;

    return (
      <SDKInput
        autocomplete="dropdown"
        autoFocus={inputAutoFocus}
        placeholder={inputPlaceholder}
        styles={{ container: { marginBottom: 0 } }}
      />
    );

    // // if there's no instant pipeline use non instant input component
    // if (!instantPipeline) {
    //   return (
    //     <div className="sj-search-holder-outer">
    //       <div className="sj-search-holder-inner">
    //         <SDKInput
    //           autoFocus={inputAutoFocus}
    //           placeholder={inputPlaceholder}
    //           values={values}
    //           pipeline={pipeline}
    //           instant={false}
    //           className="sj-search-bar-input-common"
    //         />
    //       </div>
    //     </div>
    //   );
    // }

    // return (
    //   <AutocompleteDropdownBase
    //     autoFocus={inputAutoFocus}
    //     placeholder={inputPlaceholder}
    //     values={instantValues}
    //     pipeline={instantPipeline}
    //     onForceSearch={this.handleUserForceSearch}
    //     maxSuggestions={maxSuggestions}
    //   />
    // );
  }
}
