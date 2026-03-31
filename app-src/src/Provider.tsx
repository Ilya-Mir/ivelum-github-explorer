import React from 'react';
import App from './App';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useRuntimeConfig } from './config/runtime';

const Provider = () => {
  const runtimeConfig = useRuntimeConfig();

  const client = new ApolloClient({
    uri: runtimeConfig.graphqlEndpoint || 'https://api.github.com/graphql',
    headers: runtimeConfig.wpNonce
      ? {
          'X-WP-Nonce': runtimeConfig.wpNonce,
        }
      : undefined,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

export default Provider;
