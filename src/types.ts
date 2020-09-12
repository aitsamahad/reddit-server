import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import { ObjectType } from "type-graphql";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  token: string;
};

export interface PostStructure {
  posts: Post[] | null;
  error: boolean;
  message: string;
}
