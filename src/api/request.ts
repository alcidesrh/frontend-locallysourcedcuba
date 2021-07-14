import { apolloClient } from 'src/boot/apollo';
import { DocumentNode } from 'graphql';

const request = {
  query: (query: DocumentNode, variables: unknown | null = null) =>
    apolloClient.query({ query: query, variables: variables }),
  mutate: (mutation: DocumentNode, variables: unknown) =>
    apolloClient.mutate({ mutation: mutation, variables: variables }),
};

export default request;
