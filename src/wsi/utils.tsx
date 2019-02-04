import * as React from "react";
import { createPortal } from "react-dom";
import cuid from "cuid";
import get from "dlv";

export interface PortalProps {
  element: HTMLElement | null;
  children?: React.ReactNode;
}

export function Portal(props: PortalProps) {
  let container = props.element;
  if (container == null) {
    return null;
  }

  return createPortal(props.children, container, cuid());
}

export function getRenderTargets(config: any, keys: string[]): HTMLElement[] {
  const targets: HTMLElement[] = [];

  keys.forEach(function(key) {
    const target = get(config, key, null);
    if (target === null) {
      throw new Error(
        `"${key}" is not defined in config, or element does not exist on the page`
      );
    }
    targets.push(target);
  });

  return targets;
}

export function updateQueryStringParam(key: string, value: string) {
  const baseUrl = [window.location.origin, window.location.pathname].join("");
  const urlQueryString = window.location.search;
  const newParam = `${key}=${encodeURIComponent(value)}`;

  let params = "?" + newParam;

  // If the "search" string exists, then build params from it
  if (urlQueryString) {
    const updateRegex = new RegExp("([?&])" + key + "[^&]*");
    const removeRegex = new RegExp("([?&])" + key + "=[^&;]+[&;]?");

    if (typeof value === "undefined" || value === null || value === "") {
      // Remove param if value is empty
      params = urlQueryString.replace(removeRegex, "$1");
      params = params.replace(/[&;]$/, "");
    } else if (urlQueryString.match(updateRegex) !== null) {
      // If param exists already, update it
      params = urlQueryString.replace(updateRegex, "$1" + newParam);
    } else {
      // Otherwise, add it to end of query string
      params = urlQueryString + "&" + newParam;
    }
  }

  // no parameter was set so we don't need the question mark
  params = params === "?" ? "" : params;

  window.history.replaceState({}, "", baseUrl + params);
}

export function getURLParam(param: string) {
  const paramRegexp = new RegExp(
    "[?&]" + param.replace(/[\[\]]/g, "\\$&") + "(=([^&#]*)|&|#|$)"
  );
  const value = paramRegexp.exec(window.location.href);
  return value && value[2]
    ? decodeURIComponent(value[2].replace(/\+/g, " "))
    : "";
}
