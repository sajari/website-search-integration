import cuid from "cuid";
import * as React from "react";
import * as ReactDOM from "react-dom";

export const mount = (window: Window, Root: React.ComponentType) => {
  const node = window.document.createElement("div");
  node.id = `sj-${cuid()}`;
  window.document.body.appendChild(node);
  Root.displayName = "Root";
  ReactDOM.render(<Root />, node);
};

export const error = (message: any) => {
  if (console && console.error) {
    // tslint:disable-next-line
    console.error(message);
  }
};
