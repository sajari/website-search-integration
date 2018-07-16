export const updateQueryStringParam = (key: string, value: string) => {
  const baseUrl = [window.location.origin, window.location.pathname].join("");
  const urlQueryString = window.location.search;
  const newParam = `${key}=${value}`;

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
};
