import * as React from "react";

// @ts-ignore: module missing defintions file
import { Provider, Pipeline, Values } from "sajari-react";
import { ErrorBoundary } from "./ErrorBoundary";

export interface IIntergrationProps {
  search?: {
    pipeline: Pipeline;
    values: Values;
    config: { [k: string]: any };
  };
  instant?: {
    pipeline: Pipeline;
    values: Values;
    config: { [k: string]: any };
  };
}

export class Integration extends React.Component<IIntergrationProps> {
  render() {
    const { search, instant, children } = this.props;
    return (
      <ErrorBoundary>
        <Provider search={search} instant={instant}>
          {children}
        </Provider>
      </ErrorBoundary>
    );
  }
}
