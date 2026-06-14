import { z } from "zod";

export const levelSchema = z.enum(["low", "medium", "high"]);
export type RiskLevel = z.infer<typeof levelSchema>;

export const activityTypeSchema = z.enum([
  "project_created",
  "project_updated",
  "project_analyzed",
  "simulation_generated",
  "roadmap_updated",
  "team_plan_created",
  "report_generated",
  "snapshot_created",
  "goal_created",
  "goal_completed",
  "mentor_conversation",
]);

export const notificationTypeSchema = z.enum([
  "risk_increased",
  "team_readiness_dropped",
  "project_more_viable",
  "launch_readiness_improved",
  "goal_progress",
  "attention_required",
]);

export const goalTypeSchema = z.enum([
  "readiness_score",
  "risk_reduction",
  "launch_mvp",
  "custom",
]);

export const portfolioProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["draft", "active", "archived"]),
  isStarred: z.boolean(),
  isPinned: z.boolean(),
  successScore: z.number().int().min(0).max(100).nullable(),
  riskLevel: levelSchema.nullable(),
  readinessScore: z.number().int().min(0).max(100).nullable(),
  complexity: levelSchema.nullable(),
  hasAnalysis: z.boolean(),
  hasReport: z.boolean(),
  updatedAt: z.string(),
  createdAt: z.string(),
  scoreChange: z.number().nullable(),
  requiresAttention: z.boolean(),
});

export type PortfolioProject = z.infer<typeof portfolioProjectSchema>;

export const portfolioAnalyticsSchema = z.object({
  portfolioHealthScore: z.number().int().min(0).max(100),
  averageSuccessScore: z.number(),
  averageRiskScore: z.number(),
  averageReadiness: z.number(),
  totalProjects: z.number().int(),
  analyzedProjects: z.number().int(),
  highestPotential: z
    .object({
      id: z.string(),
      title: z.string(),
      successScore: z.number(),
      readinessScore: z.number().nullable(),
    })
    .nullable(),
  mostAtRisk: z
    .object({
      id: z.string(),
      title: z.string(),
      riskLevel: levelSchema,
      successScore: z.number(),
    })
    .nullable(),
  weakestProject: z
    .object({
      id: z.string(),
      title: z.string(),
      successScore: z.number(),
    })
    .nullable(),
  mostImproved: z
    .object({
      id: z.string(),
      title: z.string(),
      scoreChange: z.number(),
      currentScore: z.number(),
    })
    .nullable(),
  projectsRequiringAttention: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      reason: z.string(),
    })
  ),
  successDistribution: z.array(
    z.object({ range: z.string(), count: z.number().int() })
  ),
  riskDistribution: z.array(
    z.object({ level: levelSchema, count: z.number().int() })
  ),
  statusBreakdown: z.array(
    z.object({
      status: z.enum(["draft", "active", "archived"]),
      count: z.number().int(),
    })
  ),
  readinessTrends: z.array(
    z.object({
      date: z.string(),
      averageReadiness: z.number(),
    })
  ),
});

export type PortfolioAnalytics = z.infer<typeof portfolioAnalyticsSchema>;

export const snapshotDataSchema = z.object({
  analysis: z.record(z.string(), z.unknown()).nullable(),
  roadmap: z.record(z.string(), z.unknown()).nullable(),
  teamPlan: z.record(z.string(), z.unknown()).nullable(),
  report: z.record(z.string(), z.unknown()).nullable(),
  riskProfile: z
    .object({
      riskLevel: levelSchema.nullable(),
      successScore: z.number().nullable(),
      readinessScore: z.number().nullable(),
    })
    .nullable(),
  projectMeta: z.object({
    title: z.string(),
    status: z.string(),
    updatedAt: z.string(),
  }),
});

export type SnapshotData = z.infer<typeof snapshotDataSchema>;

export const storedSnapshotSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  label: z.string().nullable(),
  snapshotData: snapshotDataSchema,
  createdAt: z.string(),
});

export type StoredSnapshot = z.infer<typeof storedSnapshotSchema>;

export const activityLogSchema = z.object({
  id: z.string(),
  type: activityTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  projectId: z.string().nullable(),
  projectTitle: z.string().nullable(),
  createdAt: z.string(),
});

export type ActivityLogEntry = z.infer<typeof activityLogSchema>;

export const notificationSchema = z.object({
  id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  projectId: z.string().nullable(),
  projectTitle: z.string().nullable(),
  createdAt: z.string(),
});

export type NotificationEntry = z.infer<typeof notificationSchema>;

export const goalSchema = z.object({
  id: z.string(),
  projectId: z.string().nullable(),
  projectTitle: z.string().nullable(),
  type: goalTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  targetValue: z.number().int().nullable(),
  currentValue: z.number().int(),
  targetDate: z.string().nullable(),
  isCompleted: z.boolean(),
  progress: z.number().min(0).max(100),
  createdAt: z.string(),
});

export type GoalEntry = z.infer<typeof goalSchema>;

export const improvementInsightsSchema = z.object({
  improvements: z.array(z.string().min(1)).min(0).max(10),
  regressions: z.array(z.string().min(1)).min(0).max(10),
  recommendedActions: z.array(z.string().min(1)).min(1).max(10),
  projectHealth: z.number().int().min(0).max(100),
});

export type ImprovementInsights = z.infer<typeof improvementInsightsSchema>;

export const evolutionEventSchema = z.object({
  id: z.string(),
  type: z.enum([
    "analysis",
    "simulation",
    "roadmap",
    "team_plan",
    "report",
    "snapshot",
  ]),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
  scores: z
    .object({
      successScore: z.number().nullable(),
      riskLevel: levelSchema.nullable(),
      readinessScore: z.number().nullable(),
    })
    .optional(),
  changes: z
    .object({
      successScoreDelta: z.number().nullable(),
      riskLevelChange: z.string().nullable(),
      readinessScoreDelta: z.number().nullable(),
    })
    .optional(),
});

export type EvolutionEvent = z.infer<typeof evolutionEventSchema>;

export const projectEvolutionSchema = z.object({
  projectId: z.string(),
  projectTitle: z.string(),
  events: z.array(evolutionEventSchema),
  currentAnalysis: z
    .object({
      successScore: z.number(),
      riskLevel: levelSchema,
      complexity: levelSchema,
    })
    .nullable(),
  previousAnalysis: z
    .object({
      successScore: z.number(),
      riskLevel: levelSchema,
      complexity: levelSchema,
    })
    .nullable(),
  scoreImprovements: z.array(z.string()),
  scoreDeclines: z.array(z.string()),
});

export type ProjectEvolution = z.infer<typeof projectEvolutionSchema>;

export const portfolioFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["draft", "active", "archived", "all"]).optional(),
  riskLevel: levelSchema.or(z.literal("all")).optional(),
  minSuccessScore: z.number().int().min(0).max(100).optional(),
  maxSuccessScore: z.number().int().min(0).max(100).optional(),
  minReadiness: z.number().int().min(0).max(100).optional(),
  maxReadiness: z.number().int().min(0).max(100).optional(),
  starredOnly: z.boolean().optional(),
  pinnedOnly: z.boolean().optional(),
  sortBy: z
    .enum([
      "updatedAt",
      "createdAt",
      "successScore",
      "readinessScore",
      "title",
      "riskLevel",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type PortfolioFilter = z.infer<typeof portfolioFilterSchema>;

export const portfolioGroupComparisonSchema = z.object({
  groupName: z.string(),
  projectIds: z.array(z.string()),
  averageSuccess: z.number(),
  averageRisk: z.number(),
  averageReadiness: z.number(),
  opportunityRank: z.number().int(),
  projectCount: z.number().int(),
});

export type PortfolioGroupComparison = z.infer<
  typeof portfolioGroupComparisonSchema
>;

export const createGoalSchema = z.object({
  projectId: z.string().optional(),
  type: goalTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  targetValue: z.number().int().min(0).max(100).optional(),
  targetDate: z.string().optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const createSnapshotSchema = z.object({
  projectId: z.string().min(1),
  label: z.string().max(100).optional(),
});

export type CreateSnapshotInput = z.infer<typeof createSnapshotSchema>;

export const portfolioGroupCompareSchema = z.object({
  groups: z
    .array(
      z.object({
        name: z.string().min(1),
        projectIds: z.array(z.string()).min(1),
      })
    )
    .min(2)
    .max(5),
});

export type PortfolioGroupCompareInput = z.infer<
  typeof portfolioGroupCompareSchema
>;

export const founderDashboardDataSchema = z.object({
  analytics: portfolioAnalyticsSchema,
  recentActivity: z.array(activityLogSchema),
  watchlist: z.array(portfolioProjectSchema),
  goals: z.array(goalSchema),
  notifications: z.array(notificationSchema),
  unreadNotificationCount: z.number().int(),
});

export type FounderDashboardData = z.infer<typeof founderDashboardDataSchema>;
