import { getWindowRuntimeConfig } from './config/runtime';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let __webpack_public_path__: string;

const runtimeConfig = getWindowRuntimeConfig();

if (runtimeConfig.assetBaseUrl) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __webpack_public_path__ = runtimeConfig.assetBaseUrl;
}
