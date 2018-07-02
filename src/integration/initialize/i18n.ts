import { i18n } from "@sajari/sdk-react";
import idx from "idx";
import { IntegrationConfig } from "../../config";
import { error } from "../../utils";

export const localization = (config: IntegrationConfig): void => {
  const locales = idx(config, _ => _.localization);
  const forceLang = idx(config, _ => _.forceLang);
  if (locales === undefined || locales === null) {
    return;
  }

  const resources = Object.keys(locales)
    .map(item => {
      const lang = locales[item];
      const summary = idx(lang, _ => _.summary);
      const errors = idx(lang, _ => _.errors);

      let items = [];
      if (summary !== undefined) {
        items.push({
          lang: item,
          namespace: "summary",
          items: summary
        });
      }

      if (errors !== undefined) {
        items.push({
          lang: item,
          namespace: "errors",
          items: errors
        });
      }

      return items;
    })
    .reduce((a, b) => a.concat(b), []);

  resources.forEach(resource => {
    i18n.addResourceBundle(resource.lang, resource.namespace, resource.items);
  });

  if (forceLang !== undefined) {
    i18n.changeLanguage(forceLang, (err: Error) => err && error(err));
  }
};
