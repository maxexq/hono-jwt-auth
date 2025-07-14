import type { Hono } from "hono";
import { logger } from "hono/logger";

import { dbConn } from "../db/db";
import signin from "./signin";
import signup from "./signup";
import signout from "./signout";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import { getUserById } from "../db/queries";

export const routes = (app: Hono) => {
  app.use("*", logger());

  app.use("/api/*", csrf());

  app.use(
    "/api/auth/*",
    jwt({ secret: process.env.JWT_SECRET || "", cookie: "authToken" })
  );

  app.get("/health", (c) => {
    dbConn();

    return c.json({
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    });
  });

  app.get("/", (c) => c.text("Simply JWT Auth API"));

  app.get("/api/auth/user", async (c) => {
    const db = dbConn();
    const payload = c.get("jwtPayload");

    try {
      // Fetch user by ID from JWT payload
      const user = await getUserById(db, payload.sub);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  });

  app.route("/api/signin", signin);
  app.route("/api/signup", signup);
  app.route("/api/signout", signout);
};
