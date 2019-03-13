import { ValidateType, ConfigV } from "./conf";

const configs = [
  {
    mode: "inline",
    project: "sajariptyltd", // Set this to your project.
    collection: "sajari-com", // Set this to your collection.
    values: { resultsPerPage: "10" },
    results: { showImages: false }, // Show images in results.
    pipeline: "website",
    instantPipeline: "autocomplete",
    inputPlaceholder: "Search",
    maxSuggestions: 5,
    tabFilters: {
      // Tabs configuration.
      defaultTab: "All", // Title of the default tab.
      tabs: [
        { title: "All", filter: "" },
        { title: "Blog", filter: "dir1='blog'" },
        { title: "Other", filter: "dir1!='blog'" }
      ] // Ordered list of tabs to show.
    }
  },
  {
    mode: "dynamic-content",
    project: "sajariptyltd", // Set this to your project.
    collection: "sajari-com", // Set this to your collection.
    values: { resultsPerPage: "3", q: "hello" },
    results: { showImages: false }, // Show images in results.
    pipeline: "raw",
    tracking: "none",
    searchOnLoad: true
  },
  {
    mode: "overlay",
    project: "sajariptyltd", // Set this to your project.
    collection: "sajari-com", // Set this to your collection.
    values: { resultsPerPage: "10", q: "hello" },
    results: { showImages: false }, // Show images in results.
    pipeline: "website",
    instantPipeline: "autocomplete",
    inputPlaceholder: "Search",
    autocompleteMaxSuggestions: 5,
    inputAutoFocus: true,
    tabFilters: {
      // Tabs configuration.
      defaultTab: "All", // Title of the default tab.
      tabs: [
        { title: "All", filter: "" },
        { title: "Blog", filter: "dir1='blog'" },
        { title: "Other", filter: "dir1!='blog'" }
      ] // Ordered list of tabs to show.
    }
  }
];

test.each(configs)("parse config", config => {
  expect(() => ValidateType(ConfigV, config)).not.toThrow();
});
