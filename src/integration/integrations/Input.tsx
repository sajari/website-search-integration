import * as React from "react";

import { Input as SDKInput } from "@sajari/sdk-react";

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
        inputMode={autoComplete ? "typeahead" : undefined}
        dropdownMode={autoComplete ? "suggestions" : undefined}
        placeholder={inputPlaceholder}
        styles={
          removeMarginBottom ? { container: { marginBottom: 0 } } : undefined
        }
      />
    );
  }
}
