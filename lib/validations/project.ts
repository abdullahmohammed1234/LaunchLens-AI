import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters"),
  budget: z
    .string()
    .min(1, "Budget is required")
    .max(100, "Budget must be at most 100 characters"),
  timeline: z
    .string()
    .min(1, "Timeline is required")
    .max(100, "Timeline must be at most 100 characters"),
  teamSize: z
    .number()
    .int("Team size must be a whole number")
    .min(1, "Team size must be at least 1")
    .max(1000, "Team size must be at most 1000"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "expert"], {
    message: "Please select an experience level",
  }),
  status: z.enum(["draft", "active", "archived"]).optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
] as const;

export const PROJECT_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
] as const;
