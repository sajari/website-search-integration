/**
 * Setup function for website search integrations.
 * - preload link tag for integration code
 * - init method for integration initialization
 */
function setup(window, document, script) {
  function factory() {
    let arr = [];
    let stack = function() {
      arr.push(arguments);
    };
    stack.arr = arr;

    window.sajari = window.sajari || {};
    window.sajari.ui = window.sajari.ui || [];
    window.sajari.ui.push(stack);
    return stack;
  }

  let cdn = document.createElement("link");
  cdn.href = script;
  cdn.as = "script";
  cdn.rel = "preload";
  cdn.crossorigin = true;

  let integration = document.createElement("script");
  integration.async = true;
  integration.src = script;

  document.head.appendChild(cdn);
  document.head.appendChild(integration);

  let stack = factory();
  stack.init = function(args) {
    let stack = factory();
    stack(args);
    return stack;
  };

  return stack;
}

/** minified version
 * function setup(c,a,f){function g(){var a=[],b=function(){a.push(arguments)};b.arr=a;c.sajari=c.sajari||{};c.sajari.ui=c.sajari.ui||[];c.sajari.ui.push(b);return b}var d=a.createElement("link");d.href=f;d.as="script";d.rel="preload";d.crossorigin=!0;var e=a.createElement("script");e.async=!0;e.src=f;a.head.appendChild(d);a.head.appendChild(e);a=g();a.init=function(a){var b=g();b(a);return b};return a};
 */
