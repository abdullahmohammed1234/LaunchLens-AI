import type { ExecutiveReport as ExecutiveReportRecord } from "@prisma/client";
import {
  executiveReportSchema,
  type ExecutiveReportData,
  type StoredExecutiveReport,
} from "@/types/executive-report";

export function executiveReportToResponse(
  record: ExecutiveReportRecord
): StoredExecutiveReport {
  const reportData = executiveReportSchema.parse(record.reportData);
  return {
    id: record.id,
    projectId: record.projectId,
    createdAt: record.createdAt.toISOString(),
    ...reportData,
  };
}

export function executiveReportToDbFields(report: ExecutiveReportData) {
  return {
    investmentReadinessScore: report.investmentReadinessScore,
    reportData: report,
  };
}
