import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const signupSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string("Password is required")
    .min(10, "Password must be at least 10 characters long"),
});

export const signupValidator = zValidator("json", signupSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      { error: result.error.issues.map((issue) => issue.message) },
      400
    );
  }
});
