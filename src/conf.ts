import * as t from "io-ts";
import { reporter } from "io-ts-reporters";
import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "./constants";

function withDefault<T extends t.Any>(
  type: T,
  defaultValue: t.TypeOf<T>
): t.Type<t.TypeOf<T>> {
  return new t.Type(
    type.name,
    type.is,
    (v, c) => type.validate(v != null ? v : defaultValue, c),
    type.encode
  );
}

export function ValidateType<T, O, I>(validator: t.Type<T, O, I>, input: I): T {
  const result = validator.decode(input);
  return result.fold(
    _ => {
      const messages = reporter(result);
      throw new Error(messages.join("\n"));
    },
    value => value
  );
}

const HTMLElementV = new t.Type<HTMLElement, object, unknown>(
  "HTMLElement",
  (u): u is HTMLElement => u instanceof HTMLElement,
  (u, c) =>
    t.UnknownRecord.validate(u, c).chain(s => {
      if (!isValidHTMLElement(u)) {
        return t.failure(u, c);
      }
      return t.success(s as HTMLElement);
    }),
  a => a
);

function isValidHTMLElement(value: any) {
  if (value === undefined || value === null) {
    return false;
  }

  // https://stackoverflow.com/a/384380/5995186
  return typeof HTMLElement === "object"
    ? value instanceof HTMLElement //DOM2
    : value &&
        typeof value === "object" &&
        value !== null &&
        value.nodeType === 1 &&
        typeof value.nodeName === "string";
}

const LocalizaitionConfigV = t.intersection([
  t.interface({
    forceLang: withDefault(t.string, "en")
  }),
  t.partial({
    localization: t.record(
      t.string,
      t.intersection([
        t.partial({
          summary: t.partial({
            page: t.string,
            resultsFor: t.string,
            searchInstead: t.string
          })
        }),
        t.partial({
          errors: t.partial({
            authorization: t.string,
            connection: t.string,
            parseResponse: t.string
          })
        })
      ])
    )
  })
]);

export type LocalizaitionConfig = t.TypeOf<typeof LocalizaitionConfigV>;

const StylingConfigV = t.partial({
  styling: t.partial({
    theme: t.partial({
      layout: t.partial({
        type: t.keyof({ list: null, grid: null })
      }),
      colors: t.partial({
        brand: t.partial({
          primary: t.string
        })
      })
    }),

    components: t.partial({
      input: t.partial({
        container: t.UnknownRecord, // React.CSSProperties;
        input: t.partial({
          container: t.UnknownRecord, // React.CSSProperties;
          input: t.UnknownRecord, // React.CSSProperties;
          typeahead: t.UnknownRecord, // React.CSSProperties;
          button: t.UnknownRecord // React.CSSProperties;
        })
      }),
      results: t.partial({
        container: t.UnknownRecord, // React.CSSProperties;
        item: t.UnknownRecord, // React.CSSProperties;
        result: t.partial({
          container: t.UnknownRecord, // React.CSSProperties;
          title: t.UnknownRecord, // React.CSSProperties;
          description: t.UnknownRecord, // React.CSSProperties;
          url: t.UnknownRecord // React.CSSProperties;
        })
      }),
      tabs: t.partial({
        container: t.UnknownRecord, // React.CSSProperties;
        tab: t.UnknownRecord // React.CSSProperties;
      }),
      summary: t.partial({
        container: t.UnknownRecord, // React.CSSProperties;
        override: t.partial({
          container: t.UnknownRecord // React.CSSProperties;
        })
      }),
      paginator: t.partial({
        container: t.UnknownRecord, // React.CSSProperties;
        controls: t.UnknownRecord, // React.CSSProperties;
        number: t.UnknownRecord // React.CSSProperties;
      })
    })
  })
});

export type StylingConfig = t.TypeOf<typeof StylingConfigV>;

export const ConfigV = t.intersection([
  t.interface({
    project: t.string,
    collection: t.string,
    endpoint: t.union([t.string, t.undefined]),

    mode: t.keyof({
      [INTEGRATION_TYPE_INLINE]: null,
      [INTEGRATION_TYPE_OVERLAY]: null,
      [INTEGRATION_TYPE_DYNAMIC_CONTENT]: null,
      [INTEGRATION_TYPE_SEARCH_BOX]: null
    }),

    pipeline: withDefault(t.string, "website"),
    instantPipeine: withDefault(t.string, "autocomplete"),
    maxSuggestions: withDefault(t.number, 5),

    inputMode: withDefault(
      t.keyof({
        standard: null,
        typeahead: null,
        suggestions: null
      }),
      "suggestions"
    ),
    inputPlaceholder: withDefault(t.string, "Search"),
    inputAutoFocus: withDefault(t.boolean, false),
    inputSearchButtonText: t.union([t.string, t.undefined]),

    urlQueryParam: withDefault(t.string, "q"),
    searchOnLoad: withDefault(t.boolean, false),

    attachSearchBox: t.union([HTMLElementV, t.undefined]),
    attachSearchResponse: t.union([HTMLElementV, t.undefined]),
    attachDynamicContent: t.union([HTMLElementV, t.undefined]),

    disableGA: withDefault(t.boolean, false),
    tracking: withDefault(t.keyof({ none: null, click: null }), "click"),

    values: withDefault(
      t.intersection([
        t.interface({
          q: t.union([t.string, t.undefined]),
          resultsPerPage: t.union([t.number, t.string]),
          filter: t.union([t.string, t.undefined])
        }),
        t.record(t.string, t.union([t.string, t.number, t.undefined]))
      ]),
      { q: undefined, resultsPerPage: 10, filter: undefined }
    ),
    results: withDefault(
      t.intersection([
        t.interface({
          showImages: t.boolean
        }),
        t.record(t.string, t.union([t.string, t.boolean]))
      ]),
      { showImages: false }
    ),

    tabFilters: t.union([
      t.interface({
        defaultTab: t.string,
        tabs: t.array(t.interface({ title: t.string, filter: t.string }))
      }),
      t.undefined
    ])
  }),
  LocalizaitionConfigV,
  StylingConfigV
]);

export type Config = t.TypeOf<typeof ConfigV>;
