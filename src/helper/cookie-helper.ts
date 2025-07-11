import { CookieOptions } from "hono/utils/cookie";

export const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  sameSite: "Lax", // or 'Strict' based on your requirements
  path: "/", // Cookie is valid for the entire site
  maxAge: 3600, // 1 hour in seconds
} as CookieOptions;
