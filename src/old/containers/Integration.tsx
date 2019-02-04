import get from "dlv";
import * as React from "react";

import { Pipeline, Provider, Values } from "@sajari/sdk-react";
import { INTEGRATION_TYPE_OVERLAY } from "../../constants";
import { INTEGRATION_EVENT_OVERLAY_SHOW, PubSub } from "../../wsi";
import { ErrorBoundary } from "./ErrorBoundary";

export interface IntergrationProps {
  mode: string;
  pubsub: PubSub;
  search: {
    pipeline: Pipeline;
    values: Values;
    config: { [k: string]: any };
  };
  instant: {
    pipeline: Pipeline;
    values: Values;
    config: { [k: string]: any };
  };
  theme: { [k: string]: any };
}

export class Integration extends React.Component<IntergrationProps> {
  public componentDidMount() {
    const { mode } = this.props;

    if (mode === INTEGRATION_TYPE_OVERLAY) {
      const { pubsub, search } = this.props;
      if (get(search.values.get(), get(search.config, "qParam"))) {
        pubsub.emit(INTEGRATION_EVENT_OVERLAY_SHOW);
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
