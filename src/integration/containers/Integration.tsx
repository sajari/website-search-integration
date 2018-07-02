import idx from "idx";
import * as React from "react";

import { Pipeline, Provider, Values } from "@sajari/sdk-react";
import { INTEGRATION_EVENT_OVERLAY_SHOW } from "../../events";
import { PubFn } from "../../lib/pubsub";
import { INTEGRATION_TYPE_OVERLAY } from "../constants";
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
  theme?: { [k: string]: any };
}

export class Integration extends React.Component<IntergrationProps> {
  public componentDidMount() {
    const { mode } = this.props;

    if (mode === INTEGRATION_TYPE_OVERLAY) {
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
    const { search, instant, theme, children } = this.props;
    return (
      <ErrorBoundary>
        <Provider
          search={search as any}
          instant={instant as any}
          theme={theme || {}}
        >
          {children}
        </Provider>
      </ErrorBoundary>
    );
  }
}
