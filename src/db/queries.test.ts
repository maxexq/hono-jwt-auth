import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { getUserByEmail, insertUser } from "./queries";
import { mockDbConn } from "../test/test-db";
import { Database } from "bun:sqlite";

let db: Database;

beforeEach(() => {
  db = mockDbConn();
});

afterEach(() => {
  db.close();
});

describe("insertUser", () => {
  it("should insert a user and return the user ID", async () => {
    const email = "test@test.com";
    const password = "securepassword";

    const userId = await insertUser(db, email, password);
    expect(userId).toBeDefined();
  });

  it("should not insert a user with the same email", async () => {
    const email = "test@test.com";
    const password = "securepassword";

    await insertUser(db, email, password);

    try {
      await insertUser(db, email, password);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      // @ts-ignore
      expect(error.message).toMatch(/UNIQUE constraint failed/);
    }
  });

  it("should throw an error if the password is empty", async () => {
    const email = "test@test.com";
    const password = "";

    try {
      await insertUser(db, email, password);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      // @ts-ignore
      expect(error.message).toMatch(/password must not be empty/);
    }
  });
});

describe("getUserByEmail", () => {
  it("should return a user by a given email", async () => {
    const email = "test@test.com";
    const password = "securepassword";

    await insertUser(db, email, password);

    const user = await getUserByEmail(db, email);
    expect(user).toBeDefined();
  });

  it("should return null when there is no user by that email", async () => {
    const email = "test@test.com";

    const user = await getUserByEmail(db, email);
    expect(user).toBeNull();
  });
});
