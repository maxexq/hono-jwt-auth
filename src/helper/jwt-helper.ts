import { sign } from "hono/jwt";

export const generateJwtToken = async (userId: string): Promise<string> => {
  const secret = process.env.JWT_SECRET as string;
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    sub: userId,
    iat: now,
    exp: now + 1 * 60 * 60, // Token valid for 1 hour
  };

  const token = await sign(payload, secret!);

  return token;
};
