import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Request, Response } from "express";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  token: string;
  req: Request;
  res: Response;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}
