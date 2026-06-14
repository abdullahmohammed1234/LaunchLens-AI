import { z } from "zod";

export const mentorModeSchema = z.enum(["project", "portfolio", "founder_coach"]);
export type MentorMode = z.infer<typeof mentorModeSchema>;

export const mentorTopicSchema = z.enum([
  "general",
  "health",
  "what_if",
  "execution",
  "strategy",
  "portfolio",
]);
export type MentorTopic = z.infer<typeof mentorTopicSchema>;

export const mentorSourceSchema = z.enum([
  "analysis_engine",
  "failure_simulator",
  "roadmap_generator",
  "team_builder",
  "executive_reports",
  "portfolio_analytics",
]);
export type MentorSource = z.infer<typeof mentorSourceSchema>;

export const MENTOR_SOURCE_LABELS: Record<MentorSource, string> = {
  analysis_engine: "Analysis Engine",
  failure_simulator: "Failure Simulator",
  roadmap_generator: "Roadmap Generator",
  team_builder: "Team Builder",
  executive_reports: "Executive Reports",
  portfolio_analytics: "Portfolio Analytics",
};

export const mentorPrioritySchema = z.enum(["critical", "high", "medium"]);
export type MentorPriority = z.infer<typeof mentorPrioritySchema>;

export const mentorRecommendedActionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: mentorPrioritySchema,
  impact: z.string().min(1),
});
export type MentorRecommendedAction = z.infer<
  typeof mentorRecommendedActionSchema
>;

export const mentorRelatedInsightSchema = z.object({
  title: z.string().min(1),
  insight: z.string().min(1),
  source: mentorSourceSchema,
});
export type MentorRelatedInsight = z.infer<typeof mentorRelatedInsightSchema>;

export const mentorWhatIfComparisonSchema = z.object({
  scenario: z.string().min(1),
  currentState: z.string().min(1),
  projectedState: z.string().min(1),
  impact: z.string().min(1),
  recommendation: z.string().min(1),
});
export type MentorWhatIfComparison = z.infer<
  typeof mentorWhatIfComparisonSchema
>;

export const mentorImprovementStepSchema = z.object({
  step: z.number().int().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedImpact: z.string().min(1),
  priority: mentorPrioritySchema,
});
export type MentorImprovementStep = z.infer<typeof mentorImprovementStepSchema>;

export const mentorResponseSchema = z.object({
  answer: z.string().min(1),
  confidence: z.number().min(0).max(100),
  sources: z.array(mentorSourceSchema).min(1).max(6),
  recommendedActions: z
    .array(mentorRecommendedActionSchema)
    .min(1)
    .max(8),
  relatedInsights: z.array(mentorRelatedInsightSchema).max(6),
  reasoning: z.string().min(1),
  whatIfComparisons: z.array(mentorWhatIfComparisonSchema).max(4).optional(),
  improvementPlan: z.array(mentorImprovementStepSchema).max(8).optional(),
});
export type MentorResponse = z.infer<typeof mentorResponseSchema>;

export const mentorMessageRoleSchema = z.enum(["user", "assistant"]);
export type MentorMessageRole = z.infer<typeof mentorMessageRoleSchema>;

export const storedMentorMessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: mentorMessageRoleSchema,
  content: z.string(),
  responseData: mentorResponseSchema.nullable().optional(),
  createdAt: z.string(),
});
export type StoredMentorMessage = z.infer<typeof storedMentorMessageSchema>;

export const storedMentorConversationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string().nullable(),
  projectTitle: z.string().nullable().optional(),
  title: z.string(),
  mode: mentorModeSchema,
  topic: mentorTopicSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  messages: z.array(storedMentorMessageSchema).optional(),
  messageCount: z.number().int().optional(),
});
export type StoredMentorConversation = z.infer<
  typeof storedMentorConversationSchema
>;

export const mentorChatRequestSchema = z.object({
  question: z.string().min(1).max(4000),
  projectId: z.string().min(1).optional(),
  conversationId: z.string().min(1).optional(),
  mode: mentorModeSchema.default("project"),
});
export type MentorChatRequest = z.infer<typeof mentorChatRequestSchema>;

export const mentorConversationSearchSchema = z.object({
  projectId: z.string().min(1).optional(),
  topic: mentorTopicSchema.optional(),
  query: z.string().max(200).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type MentorConversationSearch = z.infer<
  typeof mentorConversationSearchSchema
>;

export const PROJECT_MENTOR_SUGGESTIONS = [
  "How can I improve my success score?",
  "What is my biggest execution risk?",
  "What should I build first?",
  "Which skill gap matters most?",
  "How can I reduce timeline risk?",
  "Should I recruit more team members?",
  "What would increase investment readiness?",
  "How do I improve my project?",
] as const;

export const WHAT_IF_SUGGESTIONS = [
  "What if I increase my budget?",
  "What if I remove a feature from MVP scope?",
  "What if I hire another developer?",
  "What if I launch sooner?",
] as const;

export const PORTFOLIO_MENTOR_SUGGESTIONS = [
  "Which project should I prioritize?",
  "Which project has highest potential?",
  "Which project is most risky?",
  "How should I allocate my time across projects?",
] as const;

export const FOUNDER_COACH_SUGGESTIONS = [
  "Help me prioritize this week",
  "How do I manage scope creep?",
  "What should I stop doing?",
  "How do I stay execution-focused?",
] as const;

export function detectMentorTopic(question: string): MentorTopic {
  const q = question.toLowerCase();

  if (
    q.includes("what if") ||
    q.includes("what would happen") ||
    q.includes("if i increase") ||
    q.includes("if i remove") ||
    q.includes("if i hire") ||
    q.includes("if i launch sooner")
  ) {
    return "what_if";
  }

  if (
    q.includes("improve my project") ||
    q.includes("how do i improve") ||
    q.includes("improvement plan") ||
    q.includes("success score")
  ) {
    return "health";
  }

  if (
    q.includes("prioritize") ||
    q.includes("portfolio") ||
    q.includes("which project") ||
    q.includes("highest potential") ||
    q.includes("most risky")
  ) {
    return "portfolio";
  }

  if (
    q.includes("execution") ||
    q.includes("timeline") ||
    q.includes("build first") ||
    q.includes("scope") ||
    q.includes("recruit") ||
    q.includes("team member")
  ) {
    return "execution";
  }

  if (
    q.includes("investment") ||
    q.includes("strategy") ||
    q.includes("risk") ||
    q.includes("skill gap")
  ) {
    return "strategy";
  }

  return "general";
}
