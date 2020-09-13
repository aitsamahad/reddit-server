import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { TestResolver } from "./resolvers/test";
import { PostResolver } from "./resolvers/post/post";
import { UserResolver } from "./resolvers/user/user";

(async function () {
  // MikroORM Initializing and Config/Migration setup
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  // Initializing the express app
  const app = express();
  const PORT = process.env.PORT || 4545;

  // Apollo Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em, token: "some token!" }),
  });

  apolloServer.applyMiddleware({ app });

  // Starting the server
  app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
  });
})();
