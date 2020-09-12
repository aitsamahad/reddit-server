import { Resolver, Query, Mutation } from "type-graphql";

@Resolver()
export class TestResolver {
  @Query(() => String)
  hello() {
    return "Test Successful!";
  }
}
