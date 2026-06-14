import { z } from "zod";

const levelSchema = z.enum(["low", "medium", "high"]);

export const timelineEventSchema = z.object({
  month: z.number().int().min(1).max(36),
  event: z.string().min(1),
  impact: z.string().min(1),
});

export const rootCauseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  severity: levelSchema,
});

export const failureScenarioSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  probability: z.number().int().min(0).max(100),
  severity: levelSchema,
  timeline: z.array(timelineEventSchema).min(3).max(12),
  rootCauses: z.array(rootCauseSchema).min(2).max(6),
  preventionStrategies: z.array(z.string().min(1)).min(2).max(8),
});

export const failureSimulationSchema = z.object({
  scenarios: z.array(failureScenarioSchema).length(3),
});

export type Level = z.infer<typeof levelSchema>;
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type RootCause = z.infer<typeof rootCauseSchema>;
export type FailureScenario = z.infer<typeof failureScenarioSchema>;
export type FailureSimulation = z.infer<typeof failureSimulationSchema>;

export type StoredFailureSimulation = FailureSimulation & {
  id: string;
  projectId: string;
  createdAt: string;
  usedFallback?: boolean;
};

export const simulateByProjectIdSchema = z.object({
  projectId: z.string().min(1),
});

export type SimulateByProjectId = z.infer<typeof simulateByProjectIdSchema>;
