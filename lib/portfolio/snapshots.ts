import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  getLatestAnalysisForProject,
  getLatestExecutiveReportForProject,
  getLatestRoadmapForProject,
  getLatestTeamPlanForProject,
  getProjectForUser,
} from "@/lib/auth-utils";
import type { ExecutiveReportData } from "@/types/executive-report";
import type { SnapshotData, StoredSnapshot } from "@/types/portfolio";
import { calculateReadinessScore } from "@/lib/portfolio/utils";
import { logActivity } from "@/lib/portfolio/activity";

export async function createProjectSnapshot(
  userId: string,
  projectId: string,
  label?: string
): Promise<StoredSnapshot> {
  await getProjectForUser(projectId, userId);

  const [project, analysis, roadmap, teamPlan, report] = await Promise.all([
    prisma.project.findUniqueOrThrow({ where: { id: projectId } }),
    getLatestAnalysisForProject(projectId),
    getLatestRoadmapForProject(projectId),
    getLatestTeamPlanForProject(projectId),
    getLatestExecutiveReportForProject(projectId),
  ]);

  const reportData = report?.reportData as ExecutiveReportData | undefined;
  const readinessScore = report
    ? calculateReadinessScore({
        investmentReadinessScore: report.investmentReadinessScore,
        projectReadinessScore: reportData?.projectReadinessScore,
        executionReadinessScore: reportData?.executionReadinessScore,
        teamReadinessScore: reportData?.teamReadinessScore,
        launchReadinessScore: reportData?.launchReadinessScore,
      })
    : null;

  const snapshotData: SnapshotData = {
    analysis: analysis
      ? {
          successScore: analysis.successScore,
          riskLevel: analysis.riskLevel,
          complexity: analysis.complexity,
          estimatedTimelineMin: analysis.estimatedTimelineMin,
          estimatedTimelineMax: analysis.estimatedTimelineMax,
        }
      : null,
    roadmap: roadmap
      ? {
          estimatedDurationMonths: roadmap.estimatedDurationMonths,
          roadmapData: roadmap.roadmapData,
        }
      : null,
    teamPlan: teamPlan
      ? {
          recommendedTeamSize: teamPlan.recommendedTeamSize,
          teamData: teamPlan.teamData,
        }
      : null,
    report: report
      ? {
          investmentReadinessScore: report.investmentReadinessScore,
          reportData: report.reportData,
        }
      : null,
    riskProfile: {
      riskLevel: (analysis?.riskLevel as "low" | "medium" | "high" | null) ?? null,
      successScore: analysis?.successScore ?? null,
      readinessScore,
    },
    projectMeta: {
      title: project.title,
      status: project.status,
      updatedAt: project.updatedAt.toISOString(),
    },
  };

  const snapshot = await prisma.projectSnapshot.create({
    data: {
      projectId,
      userId,
      label: label ?? `Snapshot ${new Date().toLocaleDateString()}`,
      snapshotData: snapshotData as Prisma.InputJsonValue,
    },
  });

  await logActivity({
    userId,
    projectId,
    type: "snapshot_created",
    title: `Snapshot saved for ${project.title}`,
    description: label ?? "Project state captured",
  });

  return {
    id: snapshot.id,
    projectId: snapshot.projectId,
    label: snapshot.label,
    snapshotData,
    createdAt: snapshot.createdAt.toISOString(),
  };
}

export async function getProjectSnapshots(
  userId: string,
  projectId: string
): Promise<StoredSnapshot[]> {
  await getProjectForUser(projectId, userId);

  const snapshots = await prisma.projectSnapshot.findMany({
    where: { projectId, userId },
    orderBy: { createdAt: "desc" },
  });

  return snapshots.map((s) => ({
    id: s.id,
    projectId: s.projectId,
    label: s.label,
    snapshotData: s.snapshotData as SnapshotData,
    createdAt: s.createdAt.toISOString(),
  }));
}
