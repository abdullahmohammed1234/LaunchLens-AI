import { z } from "zod";

const levelSchema = z.enum(["low", "medium", "high"]);

export const skillGapSchema = z.object({
  skill: z.string().min(1),
  importance: levelSchema,
});

export const blockerSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  severity: levelSchema,
});

export const projectAnalysisSchema = z.object({
  successScore: z.number().int().min(0).max(100),
  riskLevel: levelSchema,
  complexity: levelSchema,
  estimatedTimeline: z.object({
    minMonths: z.number().int().min(1),
    maxMonths: z.number().int().min(1),
  }),
  skillGaps: z.array(skillGapSchema).min(1).max(10),
  blockers: z.array(blockerSchema).min(1).max(8),
  recommendations: z.array(z.string().min(1)).min(1).max(10),
  mvpScope: z.array(z.string().min(1)).min(1).max(10),
});

export type ProjectAnalysis = z.infer<typeof projectAnalysisSchema>;
export type SkillGap = z.infer<typeof skillGapSchema>;
export type Blocker = z.infer<typeof blockerSchema>;

export const analyzeProjectInputSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  budget: z.string().min(1).max(100),
  timeline: z.string().min(1).max(100),
  teamSize: z.number().int().min(1).max(1000),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

export type AnalyzeProjectInput = z.infer<typeof analyzeProjectInputSchema>;

export const analyzeByProjectIdSchema = z.object({
  projectId: z.string().min(1),
});

export type AnalyzeByProjectId = z.infer<typeof analyzeByProjectIdSchema>;
