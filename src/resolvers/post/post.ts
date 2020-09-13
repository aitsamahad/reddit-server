import { Resolver, Query, Mutation, Ctx, Arg, Int } from "type-graphql";
import { Post } from "../../entities/Post";
import { MyContext } from "src/generic-types";
import { PostResponse } from "./types";

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
    return ctx.em.findOne(Post, { id });
  }

  // Create a post
  @Mutation(() => PostResponse)
  async createPost(
    @Arg("title") title: string,
    @Ctx() ctx: MyContext
  ): Promise<PostResponse> {
    const newPost = ctx.em.create(Post, { title });
    await ctx.em.persistAndFlush(newPost);

    return {
      post: newPost,
    };
  }

  // Update a post
  @Mutation(() => PostResponse, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() ctx: MyContext
  ): Promise<PostResponse> {
    const post = await ctx.em.findOne(Post, { id });

    if (!post)
      return {
        errors: [{ field: "id", message: "Post not found" }],
      };

    if (typeof post !== "undefined") {
      post.title = title;
      await ctx.em.persistAndFlush(post);
    }
    return { post };
  }

  // Delete a post
  @Mutation(() => Boolean, { nullable: true })
  async deletePost(
    @Arg("id") id: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean | null> {
    const post = await ctx.em.findOne(Post, { id });

    if (!post) return false;

    await ctx.em.nativeDelete(Post, { id });
    return true;
  }
}
