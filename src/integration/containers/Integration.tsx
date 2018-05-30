import idx from "idx";
import * as React from "react";

// @ts-ignore: module missing defintions file
import { Pipeline, Provider, Values } from "sajari-react";
import { INTEGRATION_EVENT_OVERLAY_SHOW } from "../../events";
import { PubFn } from "../../lib/pubsub";
import { ErrorBoundary } from "./ErrorBoundary";

export interface IntergrationProps {
  mode: string;
  publish: PubFn;
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

export class Integration extends React.Component<IntergrationProps> {
  public componentDidMount() {
    const { mode } = this.props;

    if (mode === "overlay") {
      const { publish, search, instant } = this.props;
      if (
        // @ts-ignore: idx
        (idx(search, _ => _.values) || idx(instant, _ => _.values)).get().q
      ) {
        publish(INTEGRATION_EVENT_OVERLAY_SHOW);
      }
    }
  }

  public render() {
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
