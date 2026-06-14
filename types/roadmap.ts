import { z } from "zod";

const prioritySchema = z.enum(["low", "medium", "high"]);

export const roadmapTaskSchema = z.object({
  title: z.string().min(1),
  priority: prioritySchema,
  estimatedHours: z.number().int().min(1).max(500),
});

export const roadmapMilestoneSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const roadmapPhaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  durationWeeks: z.number().int().min(1).max(52),
  milestones: z.array(roadmapMilestoneSchema).min(1).max(8),
  tasks: z.array(roadmapTaskSchema).min(2).max(15),
});

export const buildOrderItemSchema = z.object({
  title: z.string().min(1),
  rationale: z.string().min(1),
  dependsOn: z.array(z.string()).default([]),
});

export const launchChecklistItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const criticalSuccessFactorSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const planComparisonSchema = z.object({
  currentPlanSummary: z.string().min(1),
  optimizedPlanSummary: z.string().min(1),
  durationDifference: z.string().min(1),
  scopeChanges: z.array(z.string().min(1)).min(1).max(8),
  riskMitigations: z.array(z.string().min(1)).min(1).max(8),
});

export const roadmapDataSchema = z.object({
  phases: z.array(roadmapPhaseSchema).min(3).max(6),
  launchChecklist: z.array(launchChecklistItemSchema).min(4).max(12),
  criticalSuccessFactors: z.array(criticalSuccessFactorSchema).min(3).max(8),
  recommendedBuildOrder: z.array(buildOrderItemSchema).min(4).max(10),
  planComparison: planComparisonSchema,
});

export const roadmapSchema = z.object({
  estimatedDurationMonths: z.number().int().min(1).max(36),
  phases: roadmapDataSchema.shape.phases,
  launchChecklist: roadmapDataSchema.shape.launchChecklist,
  criticalSuccessFactors: roadmapDataSchema.shape.criticalSuccessFactors,
  recommendedBuildOrder: roadmapDataSchema.shape.recommendedBuildOrder,
  planComparison: planComparisonSchema,
});

export type RoadmapPriority = z.infer<typeof prioritySchema>;
export type RoadmapTask = z.infer<typeof roadmapTaskSchema>;
export type RoadmapMilestone = z.infer<typeof roadmapMilestoneSchema>;
export type RoadmapPhase = z.infer<typeof roadmapPhaseSchema>;
export type BuildOrderItem = z.infer<typeof buildOrderItemSchema>;
export type LaunchChecklistItem = z.infer<typeof launchChecklistItemSchema>;
export type CriticalSuccessFactor = z.infer<typeof criticalSuccessFactorSchema>;
export type PlanComparison = z.infer<typeof planComparisonSchema>;
export type RoadmapData = z.infer<typeof roadmapDataSchema>;
export type Roadmap = z.infer<typeof roadmapSchema>;

export type StoredRoadmap = Roadmap & {
  id: string;
  projectId: string;
  createdAt: string;
  usedFallback?: boolean;
};

export type KanbanColumn = "backlog" | "in_progress" | "ready" | "completed";

export type KanbanTask = RoadmapTask & {
  id: string;
  phaseIndex: number;
  taskIndex: number;
  column: KanbanColumn;
};

export const generateRoadmapByProjectIdSchema = z.object({
  projectId: z.string().min(1),
});

export type GenerateRoadmapByProjectId = z.infer<
  typeof generateRoadmapByProjectIdSchema
>;
