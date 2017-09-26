# Sajari Website Search Integration

Our auto-generated search integrations are a quick and easy way to get [Sajari Website Search](https://www.sajari.com/website-search) running on your site.

This repository is used in the [Console](https://www.sajari.com/console/collections/install) to generate search interfaces which can be copy-pasted directly into your website.

This website search integration is built using the [Sajari React SDK](https://www.github.com/sajari/sajari-sdk-react).

## Instructions

We're assuming you've setup an account and have a website collection indexing. If not then you need to  [Sign Up](https://www.sajari.com/console/sign-up) and create a website collection to get started.

From the [Install tab](https://www.sajari.com/console/collections/install) in the Console you can generate a search interface which can be copy-pasted into your site.  It's easy to add further customisations using CSS (see [Styling](#styling)), or by changing the JSON config (see [Configuration](#configuration)).

![Search interface with tabs](https://cloud.githubusercontent.com/assets/2822/25603841/e50022d4-2f42-11e7-9ac0-3968714b9e1d.png)

## Styling

The generated interface can be easily styled to fit your website's look and feel, it's also designed to be responsive by default.

Here are a few CSS examples which can be used to override the default layout.

### Brand colors

* Override the link/tab colours and font.

Source: [orange.css](./sample-styles/orange.css)

![Orange](./sample-styles/orange.png)

### Brand image and colors, hiding elements

* Override the link/tab colours and font.
* Set a brand image.
* Hide URL links in results.

Source: [light.css](./sample-styles/light.css)

![Light](./sample-styles/light.png)

### Responsive layout with brand image.

* Override the link/tab colours and font.
* Set a brand image.
* Custom responsive layout for small screens.

Source: [sajari.css](./sample-styles/sajari.css)

![Sajari](./sample-styles/sajari.png)


## Integrations

There are 3 types of integration currently. In-page search, overlay search, and input only.

### In Page

The inpage search integration is for rendering inside a page or pages on your site. The most common use case is having a dedicated "search" page which has search functionality.

```javascript
myUI("create-inpage", {
  project: "<your project>",
  collection: "<your collection>",
  values: { resultsPerPage: "10", "q": getUrlParam("q") },
  attachSearchBox: document.getElementById("search-box"),
  attachSearchResponse: document.getElementById("search-response"),
  results: { showImages: false },
  pipeline: "website",
  instantPipeline: "autocomplete",
  searchInputPlaceholder: "Search",
  maxSuggestions: 5,
  tabFilters: {},
});
```

## Overlay

The overlay search integration is for rendering a search interface on top of the current page.

```javascript
myUI("create-overlay", {
  project: "<your project>",
  collection: "<your collection>",
  values: { resultsPerPage: "10", "q": getUrlParam("q") },
  results: { showImages: false },
  pipeline: "website",
  instantPipeline: "autocomplete",
  searchInputPlaceholder: "Search",
  autocompleteMaxSuggestions: 5,
  searchInputAutoFocus: true,
  tabFilters: {},
});
```

### Input Only

The input only integration is for embedding into your sites header or menu bar. It performs autocomplete on the users query and can redirect to your search results page once the user confirms their choice.

```javascript
myUI("create-input", {
  project: "<your project>",
  collection: "<your collection>",
  instantPipeline: "autocomplete",
  searchInputPlaceholder: "Search",
  maxSuggestions: 5,
  attachSearchBox: document.getElementById("autocomplete-input")
});
```

## Configuration

The generated search interfaces are configured using a simple JSON object which contains attributes that control:

* [Project/Collection](#projectcollection)
* [Pipelines](#pipelines)
* [Attaching to the DOM](#attaching-to-the-dom)
* [Maximum Suggestions](#maximum-suggestions)
* [Search Input Placeholder](#search-input-placeholder)
* [Search Input Auto Focus](#search-input-auto-focus)
* [Result Config](#result-config)
* [Algorithm parameters](#algorithm-parameters)
* [Events](#events)
* [Tab filters](#tab-filters)
* [Analytics](#analytics)

You'll find the configuration object in the snippet generated from the [install page](https://www.sajari.com/console/collections/install).

### Project/Collection

The `project` and `collection` attributes set which project/collection combo to query.  These can be found in the Console.

```javascript
project: "your-project",
collection: "your-collection",
```

### Pipelines

Pipelines determine how your collection is searched. `pipeline` sets the pipeline used to perform searches, by default this is the `website` pipeline. `autocompletePipeline` sets the pipeline used to perform autocomplete, by default this is the `autocomplete` pipeline.

```javascript
pipeline: "website",
autocompletePipeline: "autocomplete",
```

If you'd like instant search, set `autocompletePipeline` to a pipeline that does perform searches, typically `website`:

```javascript
autocompletePipeline: "website"
```

If you'd like nothing to happen until the user presses enter, only set `pipeline`, not `autocompletePipeline`:

```javascript
pipeline: "website"
```

### Maximum Suggestions

Setting `maxSuggestions` will limit how many suggestions are shown in the dropbox box below the search input.

```javascript
maxSuggestions: 5
```

### Search Input Placeholder

Setting `searchInputPlaceholder` will set the placeholder text in the search input box.

```javascript
searchInputPlaceholder: "Search"
```

### Search Input Auto Focus

Setting `searchInputAutoFocus` will set the autoFocus attribute on the search input box.

```javascript
searchInputAutoFocus: false
```

### Result Config

Result config allows you to modify the result rendering.

Show images next to search results.

```javascript
results: {
  showImages: false
},
```

### Algorithm parameters

The standard website pipeline defines several algorithm parameters. For example, `q` or `resultsPerPage`.

```javascript
values: {
  q: getUrlParam("q") // The initial search query will be the value of the query param "q".
  resultsPerPage: "10", // Show 10 results per page.
},
```

### Events

You can subscribe to events by calling your interface with the `"sub"` value followed by the pipeline (either `pipeline` or `instantPipeline`) and event name, then a callback. It takes the form

```javascript
myUI("sub", "<pipeline>.<event>", callback);
```

For example, if you are using the default in-page interface and want to listen to the `search-sent` event, you'd write:

```javascript
myUI("sub", "pipeline.search-sent", function(event, values) {
  console.log("Search sent with values: ", values);
});
```

Here is a table of events you can subscribe to.

| Event | Data | Description |
| :-- | :-: | :-- |
| `"search-sent"` | value dictionary | Search request has been sent |
| `"values-updated"` | value dictionary | Value map has updated |
| `"response-updated"` | response object | Response has updated |
| `"page-closed"` | query string | Page is about to be closed |
| `"query-reset"` | query string | Body has changed enough to be considered a new query |
| `"result-clicked"` | query string | Result has been clicked |
| `"search-event"` | query string | Search event |
| `"overlay-show"` | none | Overlay is shown |
| `"overlay-hide"` | none | Overlay is hidden |

You can also publish events which the search interface will pick up.

| Event | Data | Description |
| :-- | :-: | :-- |
| `"values-set"` | value dictionary | Values to merge in |
| `"search-send"` | none | Perform a search |
| `"overlay-show"` | none | Show the overlay |
| `"overlay-hide"` | none | Hide the overlay |

#### Search Sent

A search has sent and we are now waiting for results. The values used in the search are given to the subscribed function.

```javascript
myUI("sub", "pipeline.search-sent", function(eventName, values) {
  console.log("Search sent with ", values);
});
```

#### Values Updated

Values in the interface have been updated. A function is given as the 3rd argument that can be used to merge new values into the value dictionary, it behaves like `pub("values-set", {})` except that it doesn't trigger an event.

```javascript
myUI("sub", "pipeline.values-updated", function(eventName, values, set) {
  console.log("New values are", values);
});
```

#### Response Updated

The search response has been updated. Caused by a network response being received or results being cleared (usually because the input box has become empty).

You can see more info about the `response` object [here](https://github.com/sajari/sajari-sdk-react#listening-for-responses).

```javascript
myUI("sub", "pipeline.response-updated", function(eventName, response) {
  if (response.isEmpty()) {
    return;
  }
  if (response.isError()) {
    console.log("Got error", response.getError());
  } else {
    console.log("Got results", response.getResults());
  }
});
```

#### Search Event

A search event signals the end of a search session. A common use case of subscribing to them is for reporting.

```javascript
myUI("sub", "pipeline.search-event", function (eventName, query) {
  console.log("Search session finished, last query", query);
});
```

If you'd like more granular events you can also subscribe to these events.

```javascript
function searchFinished(eventName, query) {
  console.log("Search session finished, last query", query);
}
myUI("sub", "pipeline.page-closed", searchFinished);
myUI("sub", "pipeline.query-reset", searchFinished);
myUI("sub", "pipeline.result-clicked", searchFinished);
```

#### Overlay Show/Hide

Opening and closing the overlay can be done by publishing either the show or hide event.

**Note: The show and hide events do not have a pipeline prefixing the event name!**

```javascript
myUI("pub", "overlay-show");
myUI("pub", "overlay-hide");
```

You can also subscribe to these events

```javascript
myUI("sub", "overlay-show", function(eventName) {
  console.log("The overlay has been shown");
});
myUI("sub", "overlay-hide", function(eventName) {
  console.log("The overlay has been hidden");
});
```

#### Set Values

Merge new values into the values dictionary. Setting a value to undefined will remove it from the values dictionary.

```javascript
myUI("pub", "pipeline.values-set", { q: "<search query>" });
```

#### Search

Search will perform a search request using the values in the value map.

```javascript
myUI("pub", "pipeline.search-send");
```

### Tab filters

Create tabs to filter search results.  Tabs are rendered in a UI component when search results are shown.  If a tab is clicked then the algorithm parameter `filter` is set to the tab's `filter` attribute.

```javascript
tabFilters: {
   defaultTab: "All", // The title of the default tab.
   tabs: [
      {title: "All", filter: ""},
      {title: "Blog", filter: "dir1='blog'"}, // First directory in URL is 'blog'.
      {title: "Not Blog", filter: "dir1!='blog'"} // First directory in URL is not 'blog'.
   ],
}
```

For more information on building filter expressions, see [filters](#filters).

## Filters

Filters are used to limit the pages that are returned in a search.

Our crawler extracts common fields when it parses web pages (such as the first and second directories of URLs), which make filtering much easier.  It's well worth taking a look at all the extracted fields before you start building filters, as most use cases are quick and easy to get running.

Here is a list of the most commonly used fields.

* `title` The page title.
* `description` The page description.
* `image` The URL of an image which corresponds to the page.
* `lang` The language of the page, extracted from the `<html>` element (if present).

Fields that are based on the URL of the page (ideal for filtering on subsections of a site) are given below.  Examples here assume that the page URL is `https://www.sajari.com/blog/year-in-review`:

* `url` The full page URL: `https://www.sajari.com/blog/year-in-review`
* `dir1` The first directory of the page URL: `blog`
* `dir2` The second directory of the page URL: `year-in-review`
* `domain` The domain of the page URL: `www.sajari.com`


### Using Operators

When querying a field, there are a few operators that can be used. Note, all values must be enclosed in single quotation marks, i.e. "field *boost* must be greater than 10" is written as `boost>'10'`.

| Operator | Description | Example |
| --- | --- | --- |
| Equal To (`=`) | Field is equal to a value (*numeric* or *string*) | `dir1='blog'` |
| Not Equal To (`!=`) | Field is not equal to a value (*numeric* or *string*) | `dir1!='blog'` |
| Greater Than (`>`) | Field is greater than a *numeric* value | `boost>'10'` |
| Greater Than Or Equal To (`>=`) | Field is greater than or equal to a *numeric* value | `boost>='10'` |
| Less Than (`<`) | Field is less than a given *numeric* value | `boost<'50'` |
| Less Than Or Equal To (`<=`) | Field is less than or equal to a given *numeric* value | `boost<'50'` |
| Begins With (`^`) | Field begins with a *string* | `dir1^'bl'` |
| Ends With (`$`) | Field ends with a *string* | `dir1$'og'` |
| Contains (`~`) | Field contains a *string* | `dir1~'blog'` |
| Does Not Contain (`!~`) | Field does not contain a *string* | `dir1!~'blog'` |

### Combining expressions

It's also possible to build more complex filters by combining field filter expressions with `AND`/`OR` operators, and brackets.

| Operator | Description | Example |
| --- | --- | --- |
| `AND` | Both expressions must match | `dir1='blog' AND domain='www.sajari.com'` |
| `OR` | One expression must match | `dir1='blog' OR domain='blog.sajari.com'` |

For example, to match pages with language set to `en` on `www.sajari.com` or any page within the `en.sajari.com` domain:

    (domain='www.sajari.com' AND lang='en') OR domain='en.sajari.com'

