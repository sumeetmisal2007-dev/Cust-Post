import { describe, it, expect } from "vitest";
import { createClient } from "@/lib/supabase/client";

describe("Supabase Client Helpers (Task 13)", () => {
  it("initializes browser client with default fallback or configured env values", () => {
    const supabase = createClient();
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(typeof supabase.from).toBe("function");
  });
});
