import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  token: string;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}
