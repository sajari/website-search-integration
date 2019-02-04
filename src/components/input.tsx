import get from "dlv";
import * as React from "react";
import merge from "deepmerge";
import isPlainObject from "is-plain-object";

import { Input as SDKInput } from "@sajari/sdk-react";

export interface InputProps {
  config: { [k: string]: any };
  defaultValue?: string;
}

export default function Input(props: InputProps) {
  const { config, defaultValue } = props;
  const { mode, placeHolder, autoFocus, buttonText } = get(
    config,
    "integration.input"
  );

  return (
    <SDKInput
      {...getInputMode(mode)}
      placeholder={placeHolder}
      defaultValue={defaultValue}
      autoFocus={autoFocus}
      buttonText={buttonText}
      styles={getInputStyles(config)}
    />
  );
}

function getInputMode(mode: "typeahead" | "suggestions") {
  const inputMode = {
    mode: "standard",
    dropdownMode: "none",
    instantSearch: false
  } as {
    mode: "standard" | "typeahead";
    dropdownMode: "none" | "suggestions" | "results";
    instantSearch: boolean;
  };

  if (mode === "typeahead") {
    inputMode.mode = "typeahead";
    inputMode.instantSearch = true;
  } else if (mode === "suggestions") {
    inputMode.mode = "typeahead";
    inputMode.dropdownMode = "suggestions";
  }

  return inputMode;
}

function getInputStyles(config: any) {
  const styles = get(config, "styling.components.input") as
    | { [k: string]: any }
    | undefined;

  return merge(
    {
      container: { marginBottom: 0, flexGrow: 1 }
    },
    styles || {},
    {
      isMergeableObject: isPlainObject
    }
  );
}
