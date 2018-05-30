import * as React from "react";

import {
  Input as SDKInput
  // @ts-ignore: module missing defintion file
} from "sajari-react";

export interface InputProps {
  config: { [k: string]: any };
  autoComplete: boolean;
}

export class Input extends React.Component<InputProps> {
  public render() {
    const { config, autoComplete } = this.props;
    const { mode, inputPlaceholder, inputAutoFocus } = config;

    const removeMarginBottom = mode === "search-box" || mode === "inline";

    return (
      <SDKInput
        autocomplete={autoComplete ? "dropdown" : false}
        autoFocus={inputAutoFocus}
        placeholder={inputPlaceholder}
        styles={
          removeMarginBottom ? { container: { marginBottom: 0 } } : undefined
        }
      />
    );
  }
}
