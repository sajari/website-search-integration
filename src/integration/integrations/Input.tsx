import idx from "idx";
import * as React from "react";

import { Input as SDKInput } from "@sajari/sdk-react";
import {
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_SEARCH_BOX
} from "../constants";

export interface InputProps {
  config: { [k: string]: any };
  defaultValue?: string;
}

export class Input extends React.Component<InputProps> {
  public render() {
    const { config, defaultValue } = this.props;
    const { mode, inputPlaceholder, inputAutoFocus, inputMode } = config;

    const removeMarginBottom =
      mode === INTEGRATION_TYPE_SEARCH_BOX || mode === INTEGRATION_TYPE_INLINE;

    // @ts-ignore: idx
    const inputStyles = idx(config, _ => _.styling.components.input) as
      | { [k: string]: any }
      | undefined;

    const styles =
      inputStyles === undefined
        ? removeMarginBottom
          ? { container: { marginBottom: 0 } }
          : undefined
        : inputStyles;

    const iMode = {
      inputMode: undefined,
      dropdownMode: undefined,
      instantSearch: false
    } as {
      inputMode?: "standard" | "typeahead";
      dropdownMode?: "none" | "suggestions" | "custom";
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
