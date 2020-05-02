import { ApolloServer } from "apollo-server-express";
import * as GraphiQL from "apollo-server-module-graphiql";
import * as cors from "cors";
import * as express from "express";

import schema from "./schema";
import db from "./db";

import { execute, subscribe } from "graphql";
import { createServer, Server } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import * as url from "url";
import process from "process";

const PORT = process.env.PORT || "8080";
const WS_HOST = process.env.WS_HOST || `ws://localhost:${PORT}`;
const FRONTEND_HOST = process.env.FRONTEND_HOST || "http://localhost:3000";

type ExpressGraphQLOptionsFunction = (
  req?: express.Request,
  res?: express.Response
) => any | Promise<any>;

function graphiqlExpress(
  options: GraphiQL.GraphiQLData | ExpressGraphQLOptionsFunction
) {
  const graphiqlHandler = (
    req: express.Request,
    res: express.Response,
    next: any
  ) => {
    const query = req.url && url.parse(req.url, true).query;
    GraphiQL.resolveGraphiQLString(query, options, req).then(
      (graphiqlString: any) => {
        res.setHeader("Content-Type", "text/html");
        res.write(graphiqlString);
        res.end();
      },
      (error: any) => next(error)
    );
  };

  return graphiqlHandler;
}

export default async (port: number): Promise<Server> => {
  // connect db
  await db.connect();

  const app = express();
  const server: Server = createServer(app);

  app.use("*", cors({ origin: FRONTEND_HOST }));

  const apolloServer = new ApolloServer({
    playground: false,
    schema,
  });

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  if (module.hot) {
    app.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql",
        query:
          "# Welcome to your own GraphQL server!\n#\n" +
          "# Press Play button above to execute GraphQL query\n#\n" +
          "# You can start editing source code and see results immediately\n\n",
        subscriptionsEndpoint: `${WS_HOST}/subscriptions`,
        variables: { subject: "World" },
      })
    );
  }

  return new Promise<Server>((resolve) => {
    server.listen(port, () => {
      // tslint:disable-next-line
      new SubscriptionServer(
        {
          execute,
          schema,
          subscribe,
        },
        {
          path: "/subscriptions",
          server,
        }
      );
      resolve(server);
    });
  });
};
