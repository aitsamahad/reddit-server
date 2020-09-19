import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { UsernamePasswordInput, UserResponse } from "./types";
import { MyContext } from "src/generic-types";
import { User } from "../../entities/User";
import argon2 from "argon2";
import { v1 as uuid } from "uuid";

@Resolver()
export class UserResolver {
  // Logged In user detail query
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) return null;

    const user = await em.findOne(User, { id: req.session!.userId });
    return user;
  }

  // Register User
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (user)
      return {
        errors: [
          {
            field: "username",
            message: "Username already exists, try another username.",
          },
        ],
      };

    const hashedPassword = await argon2.hash(options.password);
    const newUser = em.create(User, {
      id: uuid({ msecs: new Date().getTime() }),
      username: options.username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await em.persistAndFlush(newUser);

    req.session!.userId = newUser.id;
    return { user: newUser };
  }

  // Login User
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse | null> {
    const user = await em.findOne(User, { username: options.username });

    if (!user)
      return {
        errors: [
          {
            field: "username",
            message: "Username does not exist!",
          },
        ],
      };

    const validate = await argon2.verify(user.password, options.password);

    if (!validate)
      return {
        errors: [
          {
            field: "password",
            message: "Password is invalid!",
          },
        ],
      };

    req.session!.userId = user.id;

    return {
      user,
    };
  }
}
