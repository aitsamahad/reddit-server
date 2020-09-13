import { Post } from "../../entities/Post";
import { InputType, Field, ObjectType } from "type-graphql";
import { FieldError } from "../../generic-types";

@InputType()
export class PostInput {
  @Field()
  title: string;
}

// Object types can be returned
@ObjectType()
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}
