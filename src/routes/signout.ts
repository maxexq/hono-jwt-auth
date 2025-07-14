import { Hono } from "hono";

import { deleteCookie } from "hono/cookie";

const signout = new Hono();

signout.get("/", async (c) => {
  deleteCookie(c, "authToken", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  });

  return c.json({ ok: true, message: "Signed out successfully" });
});

export default signout;
