import { describe, expect, it, beforeEach, afterEach, mock } from "bun:test";
import { Database } from "bun:sqlite";
import app from "..";
import { mockDbConn } from "../test/test-db";
import { signinReq, signupReq } from "../test/test-helper";

let db: Database;

mock.module("../db/db.ts", () => {
  return {
    dbConn: () => db,
  };
});

beforeEach(() => {
  db = mockDbConn();
});

afterEach(() => {
  db.close();
});

describe("Signin Route", () => {
  it("should return success message on valid signin", async () => {
    const mockEmail = "test@test.com";

    const signUpReq = signupReq();
    const signUpRes = await app.fetch(signUpReq);

    const req = signinReq();
    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      ok: true,
      message: "Login successful",
      user: { id: expect.any(String), email: mockEmail },
    });

    const cookies = signUpRes.headers.get("set-cookie");
    expect(cookies).toMatch(/authToken=/);
  });

  it("should return error 400 when email or password is missing", async () => {
    const req = signinReq("", "");
    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      error: [
        "Invalid email address",
        "Password must be at least 10 characters long",
      ],
    });
  });

  it("should return error 401 for incorrect password", async () => {
    const mockEmail = "test@test.com";
    const mockWrongEmail = "test_wrong_password";

    const signUpReq = signupReq();
    await app.fetch(signUpReq);

    const req = signinReq(mockEmail, mockWrongEmail);
    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({
      errors: ["Invalid credentials"],
    });
  });
});
