import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';
import typeDefs from './schema.graphql';

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default executableSchema;
