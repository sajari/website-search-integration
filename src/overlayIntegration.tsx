import * as React from "react";
import get from "dlv";
import { PubSub, Pipelines } from "./wsi";
import { Portal, getRenderTargets, updateQueryStringParam } from "./wsi/utils";

import IntegrationContainer from "./components/integrationContainer";
import Input from "./components/input";
import {
  Response,
  Results,
  Paginator,
  Summary,
  Pipeline,
  Values,
  Tabs,
  EVENT_SEARCH_SENT,
  Filter,
  CombineFilters,
  Overlay
} from "@sajari/sdk-react";

export default function overlayIntegration(
  config: any,
  pubsub: PubSub,
  pipelines: Pipelines
) {
  return class OverlayIntegration extends React.Component<
    {},
    { isOpen: boolean }
  > {
    state = { isOpen: false };

    render() {
      return (
        <IntegrationContainer pipelines={pipelines}>
          <Overlay
            isActive={this.state.isOpen}
            onOuterClick={this.handleOuterClick}
          >
            <Input config={config} />
          </Overlay>
        </IntegrationContainer>
      );
    }

    handleOuterClick = () => this.setState({ isOpen: false });
  };
}
