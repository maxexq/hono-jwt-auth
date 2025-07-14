import { Hono } from "hono";
import { signupValidator as signinValidator } from "../schemas/signup-schema";
import { getUserByEmail } from "../db/queries";
import { dbConn } from "../db/db";
import { generateJwtToken } from "../helper/jwt-helper";

import { setCookie } from "hono/cookie";
import { cookieOpts } from "../helper/cookie-helper";

const signin = new Hono();

signin.post("/", signinValidator, async (c) => {
  const db = dbConn();

  //validate the user's input
  const { email, password } = c.req.valid("json");

  try {
    // query user by email
    const user = await getUserByEmail(db, email);

    // if user does not exist, return error 401
    if (!user) {
      return c.json({ errors: ["Invalid credentials"] }, 401);
    }

    // verify password match
    const passwordMatch = await Bun.password.verify(
      password,
      user.password_hash
    );

    // if does not match, return error 401
    if (!passwordMatch) {
      return c.json({ errors: ["Invalid credentials"] }, 401);
    }

    // if matches, generate JWT token
    const token = await generateJwtToken(user.id);

    // set the JWT token in a cookie
    setCookie(c, "authToken", token, cookieOpts);

    // send success response with user details
    return c.json(
      {
        ok: true,
        message: "Login successful",
        user: { id: user.id, email },
      },
      200
    );
  } catch (error) {
    // send an error response if something goes wrong
    console.error("Error during signin:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default signin;
