import { Hono } from "hono";

const signin = new Hono();

signin.post("/signin", (c) => {
  return c.json({ message: "Sign-in successful" });
});

export default signin;
