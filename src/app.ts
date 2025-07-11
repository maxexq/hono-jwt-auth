import { Hono } from "hono";
import { routes } from "./routes";

const app = new Hono();

routes(app);

app.notFound((c) => {
  return c.text("404 Not found", 404);
});

export { app };
