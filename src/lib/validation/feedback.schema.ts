import { z } from "zod";

export const issueTypeEnum = z.enum([
  "confusing_guidance",
  "unsuitable_for_space",
  "missing_option",
  "incorrect_assumption",
  "other",
]);

export const feedbackSchema = z.object({
  issueType: issueTypeEnum,
  description: z.string().min(5, "Please provide at least 5 characters of feedback").max(2000),
  contextSnapshot: z.record(z.unknown()).optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
