import * as React from "react";

import { error as logError } from "../../utils";

export interface IErrorBoundryState {
  hasError: boolean;
}

export class ErrorBoundry extends React.Component<{}, IErrorBoundryState> {
  state = { hasError: false };

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState(state => ({ ...state, hasError: true }));
    logError(`${error.message}${info.componentStack}`);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return null;
    }

    return children;
  }
}
