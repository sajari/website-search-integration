import * as React from "react";

import { Input } from "./Input";

export interface InlineProps {
  config: { [k: string]: any };
  defaultValue?: string;
}

export class Inline extends React.Component<InlineProps> {
  public render() {
    const { config, defaultValue } = this.props;
    return (
      <div className="sj-inline">
        <div className="sj-logo" />
        <Input
          config={config}
          autoComplete={true}
          defaultValue={defaultValue}
        />
      </div>
    );
  }
}
