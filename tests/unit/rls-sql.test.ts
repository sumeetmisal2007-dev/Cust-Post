import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Database Migrations & RLS Policies (Tasks 11 & 12)", () => {
  const schemaSqlPath = path.resolve(
    __dirname,
    "../../supabase/migrations/20261018000001_initial_schema.sql"
  );
  const rlsSqlPath = path.resolve(
    __dirname,
    "../../supabase/migrations/20261018000002_rls_policies.sql"
  );

  const schemaSql = fs.readFileSync(schemaSqlPath, "utf-8");
  const rlsSql = fs.readFileSync(rlsSqlPath, "utf-8");

  describe("Initial Schema Verification (Task 11)", () => {
    const requiredTables = [
      "profiles",
      "containers",
      "compost_batches",
      "batch_observations",
      "recommendation_logs",
      "user_feedback",
    ];

    it.each(requiredTables)("defines table public.%s", (table) => {
      expect(schemaSql).toMatch(new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}`, "i"));
    });

    it("enforces cascading deletion on user ownership", () => {
      expect(schemaSql).toMatch(/REFERENCES auth\.users\(id\) ON DELETE CASCADE/i);
    });

    it("indexes owner_id and foreign keys for performance", () => {
      expect(schemaSql).toMatch(/CREATE INDEX IF NOT EXISTS idx_containers_owner/i);
      expect(schemaSql).toMatch(/CREATE INDEX IF NOT EXISTS idx_batches_owner/i);
      expect(schemaSql).toMatch(/CREATE INDEX IF NOT EXISTS idx_observations_batch/i);
    });
  });

  describe("Row Level Security Policies Verification (Task 12)", () => {
    const secureTables = [
      "profiles",
      "containers",
      "compost_batches",
      "batch_observations",
      "recommendation_logs",
      "user_feedback",
    ];

    it.each(secureTables)("enables RLS on public.%s", (table) => {
      expect(rlsSql).toMatch(
        new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`, "i")
      );
    });

    it("restricts container operations strictly to auth.uid() = owner_id", () => {
      expect(rlsSql).toMatch(/CREATE POLICY "Users can select own containers"[\s\S]*?auth\.uid\(\) = owner_id/i);
      expect(rlsSql).toMatch(/CREATE POLICY "Users can insert own containers"[\s\S]*?auth\.uid\(\) = owner_id/i);
      expect(rlsSql).toMatch(/CREATE POLICY "Users can update own containers"[\s\S]*?auth\.uid\(\) = owner_id/i);
      expect(rlsSql).toMatch(/CREATE POLICY "Users can delete own containers"[\s\S]*?auth\.uid\(\) = owner_id/i);
    });

    it("restricts batch operations strictly to auth.uid() = owner_id", () => {
      expect(rlsSql).toMatch(/CREATE POLICY "Users can select own batches"[\s\S]*?auth\.uid\(\) = owner_id/i);
      expect(rlsSql).toMatch(/CREATE POLICY "Users can insert own batches"[\s\S]*?auth\.uid\(\) = owner_id/i);
      expect(rlsSql).toMatch(/CREATE POLICY "Users can delete own batches"[\s\S]*?auth\.uid\(\) = owner_id/i);
    });

    it("restricts observation operations strictly to auth.uid() = owner_id", () => {
      expect(rlsSql).toMatch(/CREATE POLICY "Users can select own observations"[\s\S]*?auth\.uid\(\) = owner_id/i);
      expect(rlsSql).toMatch(/CREATE POLICY "Users can insert own observations"[\s\S]*?auth\.uid\(\) = owner_id/i);
    });
  });
});
