import { ApolloServer } from "apollo-server";
import process from "process";

import createServer from "./server";

try {
  const PORT = process.env.PORT || "8080";
  const HOST = process.env.HOST || `http://localhost:${PORT}`;

  let server: ApolloServer;

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(async (data) => {
      if (server) {
        await server.stop();
      }
      data.hotReloaded = true;
    });
    module.hot.addStatusHandler((status) => {
      if (status === "fail") {
        process.exit(250);
      }
    });
  }

  const firstStartInDevMode =
    module.hot &&
    process.env.LAST_EXIT_CODE === "0" &&
    (!module.hot.data || !module.hot.data.hotReloaded);

  createServer(parseInt(PORT)).then((serverInstance) => {
    server = serverInstance;
    serverInstance
      .listen({
        port: PORT,
        url: HOST,
      })
      .then((serverInstance) => {
        if (!module.hot || firstStartInDevMode) {
          console.log(`GraphQL Server is now running on ${HOST}.`);
        }
      });
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
