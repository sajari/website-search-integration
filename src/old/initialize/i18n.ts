import { i18n } from "@sajari/sdk-react";
import get from "dlv";
import { logError } from "../utils";

export const localization = (config: { [k: string]: any }): void => {
  const locales = get(config, "localization.locales");
  const forceLang = get(config, "localization.forceLanguage");
  if (locales === undefined || locales === null) {
    return;
  }

  Object.keys(locales)
    .map(item => {
      const lang = locales[item];
      const summary = get(lang, "summary");
      const errors = get(lang, "errors");

      const items = [];
      if (summary !== undefined) {
        items.push({
          items: summary,
          lang: item,
          namespace: "summary"
        });
      }

      if (errors !== undefined) {
        items.push({
          items: errors,
          lang: item,
          namespace: "errors"
        });
      }

      return items;
    })
    .reduce((a, b) => a.concat(b), [])
    .forEach(resource => {
      i18n.addResourceBundle(resource.lang, resource.namespace, resource.items);
    });

  if (forceLang !== undefined && forceLang !== null) {
    i18n.changeLanguage(
      forceLang,
      (err: Error | null) => err && logError(err.message)
    );
  }
};
