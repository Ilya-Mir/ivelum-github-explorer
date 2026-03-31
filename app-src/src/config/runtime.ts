import { createContext, useContext } from 'react';

export type WordPressRuntimeConfig = {
  assetBaseUrl?: string;
  defaultRoute?: string;
  graphqlEndpoint?: string;
  useHashRouter?: boolean;
  wpNonce?: string;
};

declare global {
  interface Window {
    ivelumGithubExplorer?: WordPressRuntimeConfig;
  }
}

export const getWindowRuntimeConfig = (): WordPressRuntimeConfig =>
  window.ivelumGithubExplorer ?? {};

const RuntimeConfigContext = createContext<WordPressRuntimeConfig>(
  getWindowRuntimeConfig(),
);

export const RuntimeConfigProvider = RuntimeConfigContext.Provider;

export const useRuntimeConfig = (): WordPressRuntimeConfig =>
  useContext(RuntimeConfigContext);
