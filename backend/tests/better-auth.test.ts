import { describe, it, expect } from "vitest";
import { auth } from "../src/auth/auth";

describe("Better Auth & @better-auth/infra dash plugin integration", () => {
  it("initializes auth instance with handler and api endpoints", () => {
    expect(auth).toBeDefined();
    expect(typeof auth.handler).toBe("function");
    expect(auth.api).toBeDefined();
  });

  it("registers dash plugin endpoints", () => {

    expect(auth.api).toHaveProperty("dashGetUserStats");
    expect(auth.api).toHaveProperty("getAuditLogs");
  });
});
