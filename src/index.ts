import "@babel/polyfill";

import { loaded, initialize, setup } from "./wsi";
import {
  INTEGRATION_TYPE_DYNAMIC_CONTENT,
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX
} from "./constants";
import { integration } from "./initialize";

const create = initialize({
  [INTEGRATION_TYPE_DYNAMIC_CONTENT]: setup(integration),
  [INTEGRATION_TYPE_INLINE]: setup(integration),
  [INTEGRATION_TYPE_OVERLAY]: setup(integration),
  [INTEGRATION_TYPE_SEARCH_BOX]: setup(integration)
});

loaded(window, create);
