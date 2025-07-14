import { Hono } from "hono";
import { signupValidator } from "../schemas/signup-schema";
import { getUserByEmail, insertUser } from "../db/queries";
import { dbConn } from "../db/db";
import { generateJwtToken } from "../helper/jwt-helper";

import { setCookie } from "hono/cookie";
import { cookieOpts } from "../helper/cookie-helper";

const signup = new Hono();

signup.post("/", signupValidator, async (c) => {
  const db = dbConn();

  // validate the users input
  const { email, password } = c.req.valid("json");

  try {
    // insert the user into the database
    const userId = await insertUser(db, email, password);

    // generate a JWT token
    const token = await generateJwtToken(userId);

    // put that JWT token in a cookie
    setCookie(c, "authToken", token, cookieOpts);

    // send success response
    return c.json(
      {
        ok: true,
        message: "User created successfully",
        user: { id: userId, email },
      },
      201
    );
  } catch (error) {
    // send an error response if something goes wrong
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      return c.json({ error: ["Email already exists"] }, 409);
    }

    console.error("Error creating user:", error);
    return c.json({ error: ["Internal server error"] }, 500);
  }
});

export default signup;
