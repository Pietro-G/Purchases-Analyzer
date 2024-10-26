import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './lib/graphql/schema.js';
import { resolvers } from './lib/graphql/resolvers.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
startStandaloneServer(server, { listen: { port: 4000 } })
  .then(({ url }) => console.log(`GraphQL server ready at ${url}`));
