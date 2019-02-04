import * as React from "react";
import { Provider } from "@sajari/sdk-react";
import ErrorBoundary from "./errorBoundary";
import { Pipelines } from "../wsi";

export default function IntegrationContainer({
  pipelines,
  searchOnLoad,
  children
}: {
  pipelines: Pipelines;
  searchOnLoad?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <Provider
        search={pipelines.search}
        instant={pipelines.instant}
        searchOnLoad={searchOnLoad}
      >
        {children}
      </Provider>
    </ErrorBoundary>
  );
}
