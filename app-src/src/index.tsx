import './set-public-path';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import reportWebVitals from './reportWebVitals';
import Provider from './Provider';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import {
  getWindowRuntimeConfig,
  RuntimeConfigProvider,
  WordPressRuntimeConfig,
} from './config/runtime';

const mountApp = (
  rootElement: Element,
  runtimeConfig: WordPressRuntimeConfig,
) => {
  const Router = runtimeConfig.useHashRouter ? HashRouter : BrowserRouter;
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  root.render(
    <React.StrictMode>
      <RuntimeConfigProvider value={runtimeConfig}>
        <Router>
          <Provider />
        </Router>
      </RuntimeConfigProvider>
    </React.StrictMode>,
  );
};

const globalRuntimeConfig = getWindowRuntimeConfig();
const blockRoots = Array.from(
  document.querySelectorAll('[data-ivelum-github-explorer-root="1"]'),
);

if (blockRoots.length > 0) {
  blockRoots.forEach((rootElement) => {
    mountApp(rootElement, globalRuntimeConfig);
  });
} else {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('React root element was not found.');
  }

  mountApp(rootElement, globalRuntimeConfig);
}

reportWebVitals();
