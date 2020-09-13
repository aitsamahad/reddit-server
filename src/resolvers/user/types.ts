import { User } from "../../entities/User";
import { InputType, Field, ObjectType } from "type-graphql";
import { FieldError } from "../../generic-types";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

// Object types can be returned
@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
