import { z } from "zod";

export const impactItemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),

  impactArea: z.enum([
    "ENVIRONMENTAL",
    "SOCIAL",
    "ECONOMIC",
    "TECHNICAL",
    "INDIVIDUAL",
  ]),

  likelihood: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]),

  severity: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]),
});