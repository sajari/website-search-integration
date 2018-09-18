import idx from "idx";
import * as React from "react";
import isPlainObject from "is-plain-object";
import merge from "deepmerge";

import { Input as SDKInput } from "@sajari/sdk-react";

export interface InputProps {
  config: { [k: string]: any };
  defaultValue?: string;
}

export class Input extends React.Component<InputProps> {
  public render() {
    const { config, defaultValue } = this.props;
    const { inputPlaceholder, inputAutoFocus, inputMode } = config;

    // @ts-ignore: idx
    const inputStyles = idx(config, _ => _.styling.components.input) as
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

    const iMode = {
      inputMode: "standard",
      dropdownMode: "none",
      instantSearch: false
    } as {
      inputMode: "standard" | "typeahead";
      dropdownMode: "none" | "suggestions" | "results";
      instantSearch: boolean;
    };

    if (inputMode === "typeahead") {
      iMode.inputMode = "typeahead";
      iMode.instantSearch = true;
    } else if (inputMode === "suggestions") {
      iMode.inputMode = "typeahead";
      iMode.dropdownMode = "suggestions";
    }

    return (
      <SDKInput
        mode={iMode.inputMode}
        dropdownMode={iMode.dropdownMode}
        instantSearch={iMode.instantSearch}
        placeholder={inputPlaceholder}
        defaultValue={defaultValue}
        autoFocus={inputAutoFocus}
        styles={styles}
      />
    );
  }
}
