import type { ProjectComparison as ProjectComparisonRecord } from "@prisma/client";
import {
  projectComparisonSchema,
  type ProjectComparisonResult,
  type StoredProjectComparison,
} from "@/types/project-comparison";

export function comparisonToResponse(
  record: ProjectComparisonRecord
): StoredProjectComparison {
  const comparisonData = projectComparisonSchema.parse(record.comparisonData);
  const projectIds = record.projectIds as string[];

  return {
    id: record.id,
    userId: record.userId,
    projectIds,
    createdAt: record.createdAt.toISOString(),
    ...comparisonData,
  };
}

export function comparisonToDbFields(
  userId: string,
  projectIds: string[],
  comparison: ProjectComparisonResult
) {
  return {
    userId,
    projectIds,
    comparisonData: comparison,
  };
}
