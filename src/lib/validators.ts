import { z } from "zod";

export const impactAreas = [
  "ENVIRONMENTAL",
  "SOCIAL",
  "ECONOMIC",
  "TECHNICAL",
  "INDIVIDUAL",
] as const;

export const impactLevels = ["LOW", "MEDIUM", "HIGH"] as const;

export const impactStatuses = [
  "PROPOSED",
  "APPROVED",
  "IMPLEMENTED",
  "ARCHIVED",
] as const;

export const impactItemSchema = z.object({
  title: z.string().trim().min(3).max(120),

  description: z.string().trim().min(5).max(1000),

  impactArea: z.enum(impactAreas),

  likelihood: z.enum(impactLevels),

  severity: z.enum(impactLevels),
});

export const impactItemStatusSchema = z.object({
  status: z.enum(impactStatuses),
});