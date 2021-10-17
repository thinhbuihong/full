import { hash, verify } from "argon2";
import { COOKIE_NAME } from "../constants";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { Context } from "../types/context";
import { LoginInput } from "../types/LoginInput";
import { RegisterInput } from "../types/RegisterInput";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { ForgotPasswordInput } from "../types/ForgotPassword";
import { sendEmail } from "../utls/sendEmail";
import { TokenModel } from "../models/Token";
import { v4 } from "uuid";

@Resolver()
export class UserResolver {
  @Query((_return) => User, { nullable: true })
  async currentUser(@Ctx() { req }: Context): Promise<User | undefined | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOne(req.session.userId);
    return user;
  }

  @Mutation((_returns) => UserMutationResponse)
  async register(
    @Arg("registerInput") registerInput: RegisterInput,
    @Ctx() { req }: Context
  ): // @Arg("email") email: string,
  // @Arg("username") username: string,
  // @Arg("password") password: string
  Promise<UserMutationResponse> {
    const validateRegisterInputErrors = validateRegisterInput(registerInput);
    if (validateRegisterInputErrors) {
      return {
        code: 400,
        success: false,
        ...validateRegisterInputErrors,
      };
    }

    try {
      const { username, password, email } = registerInput;
      const exitingUser = await User.findOne({
        where: [{ username }, { email }],
      });
      if (exitingUser) {
        return {
          code: 400,
          success: false,
          message: "username already existed",
          errors: [
            {
              field: exitingUser.username === username ? "username" : "email",
              message: "username or email already taken",
            },
          ],
        };
      }

      const hashedPassword = await hash(password);

      const newUser = User.create({
        username,
        password: hashedPassword,
        email,
      });

      const user = await User.save(newUser);
      req.session.userId = user.id;
      return {
        code: 200,
        success: true,
        message: "user registration successful",
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `internal server error ${error.message}`,
      };
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg("loginInput") { password, usernameOrEmail }: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOne(
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      );

      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: "user not found",
          errors: [
            {
              field: "usernameOrEmail",
              message: "username or email incorrect",
            },
          ],
        };
      }

      const passwordValid = await verify(existingUser.password, password);
      if (!passwordValid) {
        return {
          code: 400,
          success: false,
          message: "wrong password",
          errors: [{ field: "password", message: "incorrect password" }],
        };
      }

      //create session and return cookie
      req.session.userId = existingUser.id;

      return {
        code: 200,
        success: true,
        message: "logged in successfully",
        user: existingUser,
      };
    } catch (error) {
      console.log(error.message);
      return {
        code: 500,
        success: false,
        message: `internal server error ${error.message}`,
      };
    }
  }

  @Mutation((_return) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME);
      req.session.destroy((error) => {
        if (error) {
          console.log("destroying session error", error.message);
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  @Mutation((_return) => Boolean)
  async forgotPassword(
    @Arg("forgotPasswordInput") forgotPasswordInput: ForgotPasswordInput
  ): Promise<boolean> {
    const user = await User.findOne({ email: forgotPasswordInput.email });

    if (!user) {
      return true;
    }

    const resetToken = v4();
    const hashedResetToken = await hash(resetToken);

    const token = await new TokenModel({
      userId: user.id + "",
      token: hashedResetToken,
    }).save();

    await sendEmail(
      forgotPasswordInput.email,
      `<a href="http://localhost:3000/change-password?token=${token}&userId=${user.id}">click here to reset your password</a>`
    );

    return true;
  }
}
