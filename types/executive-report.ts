import { z } from "zod";

const levelSchema = z.enum(["low", "medium", "high"]);
const prioritySchema = z.enum(["critical", "high", "medium"]);
const riskSourceSchema = z.enum(["analysis", "simulation", "roadmap", "team"]);

export const criticalRiskSchema = z.object({
  title: z.string().min(1),
  severity: levelSchema,
  impact: z.string().min(1),
  likelihood: levelSchema,
  mitigation: z.string().min(1),
  source: riskSourceSchema.optional(),
});

export const recommendedStepSchema = z.object({
  title: z.string().min(1),
  priority: prioritySchema,
  impact: z.string().min(1),
  order: z.number().int().min(1),
});

export const executiveReportSchema = z.object({
  executiveSummary: z.string().min(1),
  overallAssessment: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(3).max(8),
  weaknesses: z.array(z.string().min(1)).min(3).max(8),
  criticalRisks: z.array(criticalRiskSchema).min(3).max(12),
  successFactors: z.array(z.string().min(1)).min(2).max(8),
  investmentReadinessScore: z.number().int().min(0).max(100),
  projectReadinessScore: z.number().int().min(0).max(100),
  executionReadinessScore: z.number().int().min(0).max(100),
  teamReadinessScore: z.number().int().min(0).max(100),
  launchReadinessScore: z.number().int().min(0).max(100),
  recommendedNextSteps: z.array(recommendedStepSchema).min(4).max(12),
  finalRecommendation: z.string().min(1),
});

export type Level = z.infer<typeof levelSchema>;
export type CriticalRisk = z.infer<typeof criticalRiskSchema>;
export type RecommendedStep = z.infer<typeof recommendedStepSchema>;
export type ExecutiveReportData = z.infer<typeof executiveReportSchema>;

export type StoredExecutiveReport = ExecutiveReportData & {
  id: string;
  projectId: string;
  createdAt: string;
  usedFallback?: boolean;
};

export const generateReportByProjectIdSchema = z.object({
  projectId: z.string().min(1),
});

export type GenerateReportByProjectId = z.infer<
  typeof generateReportByProjectIdSchema
>;

export const createReportShareSchema = z.object({
  reportId: z.string().min(1),
  expiresInDays: z.number().int().min(1).max(90).optional(),
});

export type CreateReportShareInput = z.infer<typeof createReportShareSchema>;

export type StoredReportShare = {
  id: string;
  reportId: string;
  token: string;
  expiresAt: string | null;
  createdAt: string;
  shareUrl: string;
};
