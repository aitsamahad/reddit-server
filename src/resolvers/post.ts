import { Resolver, Query, Mutation, Ctx, Arg, Int } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext, PostStructure } from "src/types";

@Resolver()
export class PostResolver {
  // Select * from Post Table
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    // console.log(ctx.token);
    return ctx.em.find(Post, {});
  }

  // Select single post
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    // console.log(ctx.token);
    // const post = ctx.em.find(Post, { id: id });
    // if (post) return {}
    return ctx.em.findOne(Post, { id });
  }

  // Create a post
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    const newPost = ctx.em.create(Post, { title });
    await ctx.em.persistAndFlush(newPost);
    return newPost;
  }
}
