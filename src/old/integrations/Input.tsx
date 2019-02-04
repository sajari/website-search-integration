import get from "dlv";
import * as React from "react";
import merge from "deepmerge";
import isPlainObject from "is-plain-object";

import { Input as SDKInput } from "@sajari/sdk-react";

export interface InputProps {
  config: { [k: string]: any };
  defaultValue?: string;
}

export class Input extends React.Component<InputProps> {
  public render() {
    const { config, defaultValue } = this.props;

    const inputStyles = get(config, "styling.components.input") as
      | { [k: string]: any }
      | undefined;

    const styles = merge(
      {
        container: { marginBottom: 0, flexGrow: 1 }
      },
      inputStyles || {},
      {
        isMergeableObject: isPlainObject
      }
    );

    const { mode, placeHolder, autoFocus, buttonText } = get(
      config,
      "integration.input"
    );

    const iMode = {
      inputMode: "standard",
      dropdownMode: "none",
      instantSearch: false
    } as {
      inputMode: "standard" | "typeahead";
      dropdownMode: "none" | "suggestions" | "results";
      instantSearch: boolean;
    };

    if (mode === "typeahead") {
      iMode.inputMode = "typeahead";
      iMode.instantSearch = true;
    } else if (mode === "suggestions") {
      iMode.inputMode = "typeahead";
      iMode.dropdownMode = "suggestions";
    }

    return (
      <SDKInput
        mode={iMode.inputMode}
        dropdownMode={iMode.dropdownMode}
        instantSearch={iMode.instantSearch}
        placeholder={placeHolder}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        buttonText={buttonText}
        styles={styles}
      />
    );
  }
}
