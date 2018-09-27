import * as y from "yup";
import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "./constants";

const isValidHTMLElementTest = {
  name: "isValidHTMLElement",
  message: "${path} must be a valid HTMLElement",
  test: function isValidHTMLElement(value: any) {
    if (value === undefined) {
      return true;
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
};

const pipelineConfigSchema = y.object().shape({
  qParam: y.string().default("q"),
  qOverrideParam: y.string().default("q.override"),
  qSuggestionsParam: y.string().default("q.suggestions"),
  maxSuggestions: y
    .number()
    .integer()
    .default(5),
  resultsPerPageParam: y.string().default("resultsPerPage"),
  pageParam: y.string().default("page")
});

export const schema = y.object().shape({
  project: y.string().required(),
  collection: y.string().required(),
  endpoint: y.string().notRequired(),

  mode: y
    .string()
    .oneOf([
      INTEGRATION_TYPE_INLINE,
      INTEGRATION_TYPE_OVERLAY,
      INTEGRATION_TYPE_DYNAMIC_CONTENT,
      INTEGRATION_TYPE_SEARCH_BOX
    ])
    .required(),

  values: y.object().notRequired(),
  results: y
    .object({
      showImages: y
        .boolean()
        .notRequired()
        .default(false),
      showPublishedDate: y
        .boolean()
        .notRequired()
        .default(false),
      publishedDateField: y
        .string()
        .notRequired()
        .default("published_time")
    })
    .notRequired(),

  search: y.object().shape({
    pipeline: y
      .string()
      .default("website")
      .required(),
    config: pipelineConfigSchema
  }),
  instant: y.object().shape({
    pipeline: y
      .string()
      .default("autocomplete")
      .required(),
    config: pipelineConfigSchema
  }),

  integration: y.object().shape({
    tracking: y
      .string()
      .oneOf(["none", "click"])
      .default("click"),
    enableGAEvents: y.boolean().default(true),
    urlQueryParam: y.string().default("q"),
    updateURLQueryParam: y.boolean().default(true),
    searchOnLoad: y.boolean().default(false),

    input: y.object().shape({
      mode: y
        .string()
        .oneOf(["standard", "typeahead", "suggestions"])
        .default("suggestions"),
      placeHolder: y.string().default("Search"),
      buttonText: y.string(),
      autoFocus: y.boolean().default(false)
    }),

    tabFilters: y.object().shape({
      defaultTab: y.string(),
      tabs: y.array().of(
        y.object().shape({
          title: y.string(),
          filter: y.string()
        })
      )
    })
  }),

  localization: y.object().shape({
    forceLanguage: y.string(),
    locales: y.array().of(
      y.object().shape({
        lang: y.string().required(),
        summary: y.object().shape({
          page: y.string(),
          resultsFor: y.string(),
          searchInsteadFor: y.string()
        }),
        errors: y.object().shape({
          authorization: y.string(),
          connection: y.string(),
          parseResponse: y.string()
        })
      })
    )
  }),

  render: y.object().shape({
    targets: y.object().shape({
      searchBox: y
        .mixed()
        .notRequired()
        .test(isValidHTMLElementTest),
      searchResponse: y
        .mixed()
        .notRequired()
        .test(isValidHTMLElementTest),
      dynamicContent: y
        .mixed()
        .notRequired()
        .test(isValidHTMLElementTest)
    }),

    theme: y.object().shape({
      layout: y
        .string()
        .oneOf(["list", "grid"])
        .default("list"),
      color: y.string().default("#333")
    }),

    components: y.object().shape({
      result: y.object().shape({
        title: y.object().shape({
          field: y.string().default("title"),
          class: y.string()
        }),
        description: y.object().shape({
          field: y.string().default("description"),
          class: y.string()
        }),
        image: y.object().shape({
          field: y.string().default("image"),
          class: y.string(),
          // fallback img to render if there is none present in the result
          fallback: y.string().url()
        }),
        url: y.object().shape({
          field: y.string().default("url"),
          class: y.string()
        })
      })
    })
  })
});
