import type { Hono } from "hono";
import { logger } from "hono/logger";

import { dbConn } from "../db/db";
import signin from "./signin";
import signup from "./signup";

export const routes = (app: Hono) => {
  app.use("*", logger());

  app.get("/health", (c) => {
    dbConn();

    return c.json({
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    });
  });

  app.get("/", (c) => c.text("Simply JWT Auth API"));

  app.route("/api/signin", signin);
  app.route("/api/signup", signup);
};
