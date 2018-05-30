import * as React from "react";

import { Input } from "./Input";

export interface InlineProps {
  config: { [k: string]: any };
}

export class Inline extends React.Component<InlineProps> {
  public render() {
    const { config } = this.props;
    return (
      <div className="sj-inline">
        <div className="sj-logo" />
        <Input config={config} autoComplete={true} />
      </div>
    );
  }
}
