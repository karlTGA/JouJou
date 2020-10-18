import { ApolloServer, PlaygroundConfig } from "apollo-server";
import schema from "./schema";
import db from "./db";

import process from "process";

const PORT = process.env.PORT || "8080";
const WS_HOST = process.env.WS_HOST || `ws://localhost:${PORT}`;
const FRONTEND_HOST = process.env.FRONTEND_HOST || "http://localhost:3000";

export default async (port: number): Promise<ApolloServer> => {
  // connect db
  await db.connect();

  const playgroundConfig: PlaygroundConfig = module.hot
    ? {
        endpoint: "/graphql",
        subscriptionEndpoint: `${WS_HOST}/subscriptions`,
        settings: {
          "editor.theme": "light",
        },
      }
    : false;

  const apolloServer = new ApolloServer({
    playground: playgroundConfig,
    schema,
    cors: { origin: FRONTEND_HOST },
  });

  return apolloServer;
};
