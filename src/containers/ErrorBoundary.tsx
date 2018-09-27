import * as React from "react";

import { logError } from "../utils";

export interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  public state = { hasError: false };

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState(state => ({ ...state, hasError: true }));
    logError(`${error.message}${info.componentStack}`);
  }

  public render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return null;
    }

    return children;
  }
}
