import { z } from "zod";

export const recommendationVerdictEnum = z.enum([
  "suitable",
  "suitable_with_changes",
  "unsuitable",
  "more_info_needed",
]);

export const ruleSourceSchema = z.object({
  ruleId: z.string().min(1),
  version: z.string().min(1),
  title: z.string().min(1),
  organization: z.string().min(1),
  sourceUrl: z.string().url(),
  reviewer: z.string().optional(),
  reviewDate: z.string().optional(),
});

export const ruleResultSchema = z.object({
  verdict: recommendationVerdictEnum,
  reasons: z.array(z.string()).min(1),
  requiredModifications: z.array(z.string()).default([]),
  unresolvedChecks: z.array(z.string()).default([]),
  ruleId: z.string(),
  ruleVersion: z.string(),
  sourceTitle: z.string(),
  sourceUrl: z.string().optional(),
  reviewer: z.string().optional(),
});

export type RuleSourceValues = z.infer<typeof ruleSourceSchema>;
export type RuleResultValues = z.infer<typeof ruleResultSchema>;
