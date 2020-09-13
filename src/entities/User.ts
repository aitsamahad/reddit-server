import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import GraphQLUUID from "graphql-type-uuid";

@ObjectType()
@Entity()
export class User {
  @Field(() => GraphQLUUID)
  @PrimaryKey()
  @Property({ type: "uuid" })
  id!: typeof GraphQLUUID | string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({ unique: true })
  username!: string;

  @Property()
  password: string;

  //   @ManyToOne() // when you provide correct type hint, ORM will read it for you
  //   author!: Author;

  //   @ManyToOne(() => Publisher) // or you can specify the entity as class reference or string name
  //   publisher?: Publisher;

  //   @ManyToMany() // owning side can be simple as this!
  //   tags = new Collection<BookTag>(this);

  //   constructor(title: string, author: Author) {
  //     this.title = title;
  //     this.author = author;
  //   }
}
