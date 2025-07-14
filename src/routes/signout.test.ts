import { describe, it, expect } from "bun:test";
import { signoutReq } from "../test/test-helper";
import { app } from "../app";

describe("Signout Route", () => {
  it("should return Signed out successfully", async () => {
    const signOut = signoutReq();
    const res = await app.fetch(signOut);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      ok: true,
      message: "Signed out successfully",
    });

    const cookes = res.headers.get("set-cookie");
    expect(cookes).toMatch(/authToken=;/);
  });
});
