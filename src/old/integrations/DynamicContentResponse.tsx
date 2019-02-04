import * as React from "react";
import { Results } from "../components/Results";

export interface DynamicContentResponseProps {
  config: { [k: string]: any };
}

export const DynamicContentResponse: React.SFC<
  DynamicContentResponseProps
> = props => (
  <div className="sj-dynamic-content">
    <Results config={props.config} />
  </div>
);
