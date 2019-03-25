import {GraphQLServer} from 'graphql-yoga';
import logger from './logger';

(global as any).logger = logger;

// 1
const typeDefs = `
type Query {
  info: String!
}
`;

// 2
const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews Clone',
    },
};

// 3
const server = new GraphQLServer({
    resolvers,
    typeDefs,
});

server.start(() => logger.info('Server is running on http://localhost:4000'));
