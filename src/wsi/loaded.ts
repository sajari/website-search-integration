type CallbackFn = (window: Window, type?: string) => void;

export default function loaded(window: Window, fn: CallbackFn) {
  let done = false;
  let top = true;

  const document = window.document;
  const root = document.documentElement;
  const modern = document.addEventListener;

  const addListener = modern ? "addEventListener" : "attachEvent";
  const removeListener = modern ? "removeEventListener" : "detachEvent";
  const pre = modern ? "" : "on";

  const init = (event: Event) => {
    if (
      event.type === "readystatechange" &&
      document.readyState !== "complete"
    ) {
      return;
    }
    (event.type === "load" ? window : document)[removeListener](
      pre + event.type,
      init,
      false
    );

    if (!done) {
      done = true;
      fn(window, event.type);
    }
  };

  const poll = () => {
    try {
      // @ts-ignore
      root.doScroll("left");
    } catch (e) {
      setTimeout(poll, 50);
      return;
    }
    init(new Event("poll"));
  };

  if (document.readyState === "complete") {
    fn(window, "lazy");
  } else {
    // @ts-ignore
    if (!modern && root.doScroll) {
      try {
        top = !window.frameElement;
        // tslint:disable-next-line
      } catch (e) {}

      if (top) {
        poll();
      }
    }

    document[addListener](pre + "DOMContentLoaded", init, false);
    document[addListener](pre + "readystatechange", init, false);
    window[addListener](pre + "load", init, false);
  }
}
