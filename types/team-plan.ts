import { z } from "zod";

export const rolePrioritySchema = z.enum(["critical", "high", "medium", "low"]);
export const severitySchema = z.enum(["low", "medium", "high"]);
export const skillCategorySchema = z.enum(["critical", "important", "optional"]);

export const teamRoleSchema = z.object({
  title: z.string().min(1),
  priority: rolePrioritySchema,
  reason: z.string().min(1),
  responsibilities: z.array(z.string().min(1)).min(1).max(8),
  skills: z.array(z.string().min(1)).min(1).max(10),
});

export const teamSkillGapSchema = z.object({
  skill: z.string().min(1),
  severity: severitySchema,
  reason: z.string().min(1),
  category: skillCategorySchema,
});

export const skillReadinessSchema = z.object({
  skill: z.string().min(1),
  currentLevel: z.number().int().min(0).max(100),
  requiredLevel: z.number().int().min(0).max(100),
  category: skillCategorySchema,
});

export const teamRiskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  severity: severitySchema,
  mitigation: z.string().min(1),
});

export const hiringOrderItemSchema = z.object({
  title: z.string().min(1),
  priority: rolePrioritySchema,
  timing: z.string().min(1),
  rationale: z.string().min(1),
});

export const founderRecommendationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const teamScenarioSchema = z.object({
  name: z.enum(["Solo Founder", "Small Team", "Expanded Team"]),
  successImpact: z.string().min(1),
  costImpact: z.string().min(1),
  timelineImpact: z.string().min(1),
  riskImpact: z.string().min(1),
  summary: z.string().min(1),
});

export const teamPlanDataSchema = z.object({
  roles: z.array(teamRoleSchema).min(2).max(10),
  skillGaps: z.array(teamSkillGapSchema).min(2).max(15),
  skillReadiness: z.array(skillReadinessSchema).min(3).max(12),
  teamRisks: z.array(teamRiskSchema).min(2).max(10),
  hiringOrder: z.array(hiringOrderItemSchema).min(2).max(8),
  founderRecommendations: z.array(founderRecommendationSchema).min(3).max(10),
  teamScenarios: z.array(teamScenarioSchema).length(3),
});

export const teamPlanSchema = z.object({
  recommendedTeamSize: z.number().int().min(1).max(50),
  roles: teamPlanDataSchema.shape.roles,
  skillGaps: teamPlanDataSchema.shape.skillGaps,
  skillReadiness: teamPlanDataSchema.shape.skillReadiness,
  teamRisks: teamPlanDataSchema.shape.teamRisks,
  hiringOrder: teamPlanDataSchema.shape.hiringOrder,
  founderRecommendations: teamPlanDataSchema.shape.founderRecommendations,
  teamScenarios: teamPlanDataSchema.shape.teamScenarios,
});

export type RolePriority = z.infer<typeof rolePrioritySchema>;
export type Severity = z.infer<typeof severitySchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type TeamRole = z.infer<typeof teamRoleSchema>;
export type TeamSkillGap = z.infer<typeof teamSkillGapSchema>;
export type SkillReadiness = z.infer<typeof skillReadinessSchema>;
export type TeamRisk = z.infer<typeof teamRiskSchema>;
export type HiringOrderItem = z.infer<typeof hiringOrderItemSchema>;
export type FounderRecommendation = z.infer<typeof founderRecommendationSchema>;
export type TeamScenario = z.infer<typeof teamScenarioSchema>;
export type TeamPlanData = z.infer<typeof teamPlanDataSchema>;
export type TeamPlan = z.infer<typeof teamPlanSchema>;

export type StoredTeamPlan = TeamPlan & {
  id: string;
  projectId: string;
  createdAt: string;
  usedFallback?: boolean;
};

export const generateTeamPlanByProjectIdSchema = z.object({
  projectId: z.string().min(1),
});

export type GenerateTeamPlanByProjectId = z.infer<
  typeof generateTeamPlanByProjectIdSchema
>;
