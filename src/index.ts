import "@babel/polyfill";

import { loaded, initialize, setup } from "./wsi";
import {
  INTEGRATION_TYPE_INLINE,
  INTEGRATION_TYPE_OVERLAY,
  INTEGRATION_TYPE_SEARCH_BOX,
  INTEGRATION_TYPE_DYNAMIC_CONTENT
} from "./constants";

import inlineIntegration from "./inlineIntegration";
import overlayIntegration from "./overlayIntegration";

const create = initialize({
  [INTEGRATION_TYPE_INLINE]: setup(inlineIntegration),
  [INTEGRATION_TYPE_OVERLAY]: setup(overlayIntegration)
  // [INTEGRATION_TYPE_SEARCH_BOX]: setup(integration),
  // [INTEGRATION_TYPE_DYNAMIC_CONTENT]: setup(integration),
});

loaded(window, create);
