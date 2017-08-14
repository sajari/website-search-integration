# Sajari Website Search Integration

Our auto-generated search integrations are a quick and easy way to get [Sajari Website Search](https://www.sajari.com/website-search) running on your site.

This repository is used in the [Console](https://www.sajari.com/console/collections/install) to generate search interfaces which can be copy-pasted directly into your website.

This website search integration is built using the [Sajari React SDK](https://www.github.com/sajari/sajari-sdk-react).

## Instructions

We're assuming you've already setup an account and have a website collection already indexing. If not then you need to  [Sign Up](https://www.sajari.com/console/sign-up) and create a website collection to get started.

From the [Install tab](https://www.sajari.com/console/collections/install) in the Console you can generate a search interface which can be copy-pasted into your site.  It's easy to add further customisations using CSS (see [Styling](#styling)), or by changing the JSON config (see [Configuration](#configuration)).

![Search interface with tabs](https://cloud.githubusercontent.com/assets/2822/25603841/e50022d4-2f42-11e7-9ac0-3968714b9e1d.png)

The configuration required for this example is given below.  For more details, see [Configuration](#configuration).

```javascript
{
  "project": "your-project",
  "collection": "your-collection",
  "searchBoxPlaceHolder": "Search",
  "attachSearchBox": document.getElementById("search-box"),
  "attachSearchResponse": document.getElementById("search-response"),
  "pipeline": "website",
  "tabFilters": {
    "defaultTab": "All",
    "tabs": [
      {"title": "All", "filter": ""},
      {"title": "Blog", "filter": "dir1='blog'"}
    ]
  },
  "results": {
    "showImages": false
  },
  "values": {
    "resultsPerPage": "10"
  },
  "initialValues": {
    "q": getUrlParam("q")
  },
  "overlay": false
}
```

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

## Configuration

The generated search interfaces are configured using a simple JSON object which contains attributes that control:

* [Project/Collection](#projectcollection)
* [Pipeline](#pipeline)
* [Attaching to the DOM](#attaching-to-the-dom)
* [Result Config](#result-config)
* [Search box place holder text](#search-box-placeholder-text)
* [Algorithm parameters](#algorithm-parameters)
* [Initial Values](#initial-values)
* [Tab filters](#tab-filters)

You'll find the configuration object in the snippet generated from the [install page](https://www.sajari.com/console/collections/install).

### Project/Collection

The `project` and `collection` attributes set which project/collection combo to query.  These can be found in the Console.

```javascript
project: "your-project",
collection: "your-collection",
```

### Pipeline

Pipeline sets the query pipeline to use for the search interface.  The default pipeline for website search is `website`.

```javascript
pipeline: "website",
```

### Attaching to the DOM

The interface can be displayed in two ways, in page or as an overlay.

To display in page, set the `attachSearchBox` and `attachSearchResponse` values.
These two attributes control which DOM elements the search box and results components will be rendered in.

```javascript
attachSearchBox: document.getElementById("search-box"),
attachSearchResponse: document.getElementById("search-response"),
```

To display as an overlay, set the `overlay` value.

```javascript
overlay: true
```

To open the overlay, call the show method from javascript.

```javascript
window._sjui.overlay.show();
```

For example, launching the overlay when a button is clicked

```html
<button onclick="window._sjui.overlay.show()">Search</button>
```

### Result Config

Result config allows you to modify the result rendering.

Show images next to search results.

```javascript
results: {
  showImages: false
},
```

### Search box placeholder text

Set the placeholder text in the search box.

```javascript
searchBoxPlaceHolder: "Search",
```

### Algorithm parameters

The standard website pipeline defines several algorithm parameters. For example, `resultsPerPage`.

```javascript
values: {
   resultsPerPage: "10", // Show 10 results per page.
},
```

### Initial Values

These values described in this section are only added to the value map when the app starts.
If the overlay is closed or the query is cleared, these values will be removed.

```javascript
initialValues: {
  q: getUrlParam("q") // The initial search query will be the value of the query param "q".
}
```

### Events

You can subscribe to events by calling your interface with the `"sub"` value followed by the event name and then a callback.

```javascript
myUI("sub", "<event>", function() {});
```

| Event | Data | Description |
| :-- | :-: | :-- |
| `"search-sent"` | value dictionary | Search request has been sent |
| `"values-changed"` | value dictionary | Value map has changed |
| `"response-updated"` | response object | Response has updated |
| `"page-close"` | query string | Page is about to be closed |
| `"query-reset"` | query string | Body has changed enough to be considered a new query |
| `"result-clicked"` | query string | Result has been clicked |
| `"search-event"` | query string | Search event |
| `"overlay-show"` | none | Overlay is shown |
| `"overlay-hide"` | none | Overlay is hidden |

You can also publish events which the search interface will pick up.

| Event | Data | Description |
| :-- | :-: | :-- |
| `"set-values"` | value dictionary | Values to set |
| `"search"` | none | Perform a search |

#### Search Sent

```javascript
myUI("sub", "search-sent", function(eventName, values) {
  console.log("Search sent with ", values);
});
```

#### Values Changed

```javascript
myUI("sub", "values-changed", function(eventName, values) {
  console.log("New values are", values);
});
```

#### Response Updated

```javascript
myUI("sub", "response-updated", function(eventName, response) {
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

#### Search Session End

There are 3 events that signal the end of a search session. You can subscribe to this individually or all at once.

**Individually:**

```javascript
function searchFinished(eventName, query) {
  console.log("Search session finished, last query", query);
}
myUI("sub", "page-close", searchFinished);
myUI("sub", "query-reset", searchFinished);
myUI("sub", "result-clicked", searchFinished);
```

**At Once:**

```javascript
myUI("sub", "search-event", function (eventName, query) {
  console.log("Search session finished, last query", query);
});
```

#### Overlay Shown/Hidden

```javascript
myUI("sub", "overlay-show", function(eventName) {
  console.log("The overlay has been shown");
});
myUI("sub", "overlay-hide", function(eventName) {
  console.log("The overlay has been hidden");
});
```

#### Set Values

```javascript
myUI("pub", "set-values", { q: "<search query>" });
```

#### Search

```javascript
myUI("pub", "search");
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

#### Constructing Filters

Our crawler extracts common fields when it parses web pages (such as the first and second directories of URLs), which make filtering much easier.  It's well worth taking a look at all the extracted fields before you start building filters, as most use cases are quick and easy to get running.

Here is a list of the most commonly used fields.

* `title` The page title.
* `description` The page description.
* `image` The URL of an image which corresponds to the page.

Fields that are based on the URL of the page (ideal for filtering on subsections of a site) are given below.  Examples here assume that the page URL is `https://www.sajari.com/blog/year-in-review`:

* `url` The full page URL: `https://www.sajari.com/blog/year-in-review`
* `dir1` The first directory of the page URL: `blog`
* `dir2` The second directory of the page URL: `year-in-review`
* `domain` The domain of the page URL: `www.sajari.com`


#### Using Operators

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
