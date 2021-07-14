import { graphqlUri } from 'src/config/app';
module.exports = {
  client: {
    service: {
      name: 'Locallysourcedcuba-frontend',
      // URL to the GraphQL API
      url: graphqlUri,
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js'],
  },
};
