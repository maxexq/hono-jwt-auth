import { describe, expect, it, beforeEach, afterEach, mock } from "bun:test";
import { Database } from "bun:sqlite";
import app from "../";
import { mockDbConn } from "../test/test-db";
import { signupReq } from "../test/test-helper";

describe("Signup Route", () => {
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

  it("should return success message on valid signup", async () => {
    const mockEmail = "test@test.com";

    const req = signupReq();
    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({
      ok: true,
      message: "User created successfully",
      user: { id: expect.any(String), email: mockEmail },
    });

    const cookies = res.headers.get("set-cookie");
    expect(cookies).toMatch(/authToken=/);
  });

  it("should return error for duplicate email", async () => {
    const req = signupReq();
    const res = await app.fetch(req);
    expect(res.status).toBe(201);

    const duplicateReq = signupReq();
    const duplicateRes = await app.fetch(duplicateReq);
    const json = await duplicateRes.json();
    expect(duplicateRes.status).toBe(409);
    expect(json).toEqual({ error: ["Email already exists"] });
  });

  it("should return error for invalid email format", async () => {
    const req = signupReq("invalid-email");
    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: ["Invalid email address"] });
  });

  it("should return error for missing password", async () => {
    const req = signupReq("test@test.com", "");
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual({
      error: ["Password must be at least 10 characters long"],
    });
  });
});
