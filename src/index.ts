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
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

// Initializing the express app
const app = express();
const PORT = process.env.PORT || 4545;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

(async function () {
  // MikroORM Initializing and Config/Migration setup
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  app.use(
    session({
      name: "sid",
      // disableTouch is expiration setting of session
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      secret: process.env.SECRET || "My Super Secret String",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 12, // 1 Year
        httpOnly: true,
        sameSite: "lax", // CSRF protection settings
        secure: __prod__, // for https
      },
    })
  );
  // Apollo Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      token: "some token!",
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // Starting the server
  app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
  });
})();
