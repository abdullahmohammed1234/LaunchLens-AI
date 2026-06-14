import { z } from "zod";

const levelSchema = z.enum(["low", "medium", "high"]);

export const comparisonCategorySchema = z.object({
  name: z.string().min(1),
  winner: z.string().min(1),
  reason: z.string().min(1),
});

export const projectScoreSchema = z.object({
  projectId: z.string().min(1),
  overallScore: z.number().int().min(0).max(100),
});

export const metricHighlightsSchema = z.object({
  bestOverall: z.string().min(1),
  highestSuccess: z.string().min(1),
  lowestRisk: z.string().min(1),
  fastestLaunch: z.string().min(1),
  lowestComplexity: z.string().min(1),
  bestSkillFit: z.string().min(1),
});

export const headToHeadValueSchema = z.object({
  projectId: z.string().min(1),
  score: z.number().int().min(0).max(100),
  label: z.string().min(1),
  level: levelSchema.optional(),
});

export const headToHeadMetricSchema = z.object({
  name: z.enum([
    "Success Probability",
    "Risk",
    "Complexity",
    "Timeline",
    "Team Size",
    "Skill Gap Severity",
    "Failure Risk",
    "Execution Difficulty",
  ]),
  values: z.array(headToHeadValueSchema).min(2).max(5),
});

export const radarDimensionSchema = z.object({
  projectId: z.string().min(1),
  risk: z.number().int().min(0).max(100),
  complexity: z.number().int().min(0).max(100),
  execution: z.number().int().min(0).max(100),
  teamNeeds: z.number().int().min(0).max(100),
  readiness: z.number().int().min(0).max(100),
});

export const barChartEntrySchema = z.object({
  projectId: z.string().min(1),
  timelineMonths: z.number().min(1),
  teamSize: z.number().int().min(1),
  successScore: z.number().int().min(0).max(100),
});

export const scenarioComparisonEntrySchema = z.object({
  projectId: z.string().min(1),
  mostLikelyFailure: z.string().min(1),
  probability: z.number().int().min(0).max(100),
  severity: levelSchema,
  summary: z.string().min(1),
});

export const roadmapComparisonEntrySchema = z.object({
  projectId: z.string().min(1),
  durationMonths: z.number().int().min(1),
  milestoneCount: z.number().int().min(0),
  taskCount: z.number().int().min(0),
  launchReadiness: z.number().int().min(0).max(100),
  executionDifficulty: levelSchema,
});

export const teamComparisonEntrySchema = z.object({
  projectId: z.string().min(1),
  teamSize: z.number().int().min(1),
  criticalRoles: z.array(z.string().min(1)).min(1).max(6),
  skillGapCount: z.number().int().min(0),
  skillGapSeverity: levelSchema,
  hiringDifficulty: levelSchema,
});

export const decisionEngineSchema = z.object({
  recommendedProjectId: z.string().min(1),
  whyItWins: z.string().min(1),
  tradeoffs: z.array(z.string().min(1)).min(1).max(5),
  strategicAdvice: z.string().min(1),
});

export const whatIfImpactSchema = z.object({
  projectId: z.string().min(1),
  previousScore: z.number().int().min(0).max(100),
  newScore: z.number().int().min(0).max(100),
  rankChange: z.number().int(),
});

export const projectComparisonSchema = z.object({
  winner: z.string().min(1),
  comparisonSummary: z.string().min(1),
  categories: z.array(comparisonCategorySchema).min(7).max(10),
  projectScores: z.array(projectScoreSchema).min(2).max(5),
  recommendations: z.array(z.string().min(1)).min(3).max(8),
  highlights: metricHighlightsSchema,
  headToHead: z.array(headToHeadMetricSchema).length(8),
  radarData: z.array(radarDimensionSchema).min(2).max(5),
  barChartData: z.array(barChartEntrySchema).min(2).max(5),
  scenarioComparison: z.array(scenarioComparisonEntrySchema).min(2).max(5),
  roadmapComparison: z.array(roadmapComparisonEntrySchema).min(2).max(5),
  teamComparison: z.array(teamComparisonEntrySchema).min(2).max(5),
  decision: decisionEngineSchema,
  whatIfImpact: z.array(whatIfImpactSchema).optional(),
});

export type ComparisonCategory = z.infer<typeof comparisonCategorySchema>;
export type ProjectScore = z.infer<typeof projectScoreSchema>;
export type MetricHighlights = z.infer<typeof metricHighlightsSchema>;
export type HeadToHeadMetric = z.infer<typeof headToHeadMetricSchema>;
export type RadarDimension = z.infer<typeof radarDimensionSchema>;
export type BarChartEntry = z.infer<typeof barChartEntrySchema>;
export type ScenarioComparisonEntry = z.infer<
  typeof scenarioComparisonEntrySchema
>;
export type RoadmapComparisonEntry = z.infer<
  typeof roadmapComparisonEntrySchema
>;
export type TeamComparisonEntry = z.infer<typeof teamComparisonEntrySchema>;
export type DecisionEngine = z.infer<typeof decisionEngineSchema>;
export type WhatIfImpact = z.infer<typeof whatIfImpactSchema>;
export type ProjectComparisonResult = z.infer<typeof projectComparisonSchema>;

export type StoredProjectComparison = ProjectComparisonResult & {
  id: string;
  userId: string;
  projectIds: string[];
  createdAt: string;
  usedFallback?: boolean;
};

export const whatIfParametersSchema = z
  .object({
    budgetIncreasePercent: z.number().min(0).max(200).optional(),
    timelineExtensionMonths: z.number().min(0).max(24).optional(),
    additionalTeamMembers: z.number().int().min(0).max(20).optional(),
  })
  .optional();

export const compareProjectsRequestSchema = z.object({
  projectIds: z.array(z.string().min(1)).min(2).max(5),
  whatIf: whatIfParametersSchema,
});

export type WhatIfParameters = z.infer<typeof whatIfParametersSchema>;
export type CompareProjectsRequest = z.infer<
  typeof compareProjectsRequestSchema
>;
