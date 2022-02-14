import { boot } from 'quasar/wrappers';
import { graphqlUri } from 'src/config/app';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
  from,
} from '@apollo/client/core';

import { DefaultApolloClient } from '@vue/apollo-composable';

import omitDeep from 'omit-deep';
// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: graphqlUri as string,
});

const middleWareLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    operation.variables = omitDeep(operation.variables, [
      '__typename',
      '_id',
    ]) as Record<string, unknown>;
  }
  return forward(operation);
});

// Cache implementation
export const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: from([middleWareLink, httpLink]),
  cache,
});

export default boot(({ app }) => {
  app.provide(DefaultApolloClient, apolloClient);
});
