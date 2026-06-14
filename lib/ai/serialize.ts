import type { Analysis } from "@prisma/client";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import { blockerSchema, skillGapSchema } from "@/lib/validations/analysis";

export function analysisToResponse(record: Analysis): ProjectAnalysis & {
  id: string;
  projectId: string;
  createdAt: string;
} {
  return {
    id: record.id,
    projectId: record.projectId,
    createdAt: record.createdAt.toISOString(),
    successScore: record.successScore,
    riskLevel: record.riskLevel as ProjectAnalysis["riskLevel"],
    complexity: record.complexity as ProjectAnalysis["complexity"],
    estimatedTimeline: {
      minMonths: record.estimatedTimelineMin,
      maxMonths: record.estimatedTimelineMax,
    },
    skillGaps: skillGapSchema.array().parse(record.skillGaps),
    blockers: blockerSchema.array().parse(record.blockers),
    recommendations: record.recommendations as string[],
    mvpScope: record.mvpScope as string[],
  };
}

export function analysisResultToDbFields(analysis: ProjectAnalysis) {
  return {
    successScore: analysis.successScore,
    riskLevel: analysis.riskLevel,
    complexity: analysis.complexity,
    estimatedTimelineMin: analysis.estimatedTimeline.minMonths,
    estimatedTimelineMax: analysis.estimatedTimeline.maxMonths,
    skillGaps: analysis.skillGaps,
    blockers: analysis.blockers,
    recommendations: analysis.recommendations,
    mvpScope: analysis.mvpScope,
  };
}
