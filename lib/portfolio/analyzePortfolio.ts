import { prisma } from "@/lib/prisma";
import type { ExecutiveReportData } from "@/types/executive-report";
import type {
  PortfolioAnalytics,
  PortfolioProject,
  RiskLevel,
} from "@/types/portfolio";
import {
  calculatePortfolioHealth,
  calculateReadinessScore,
  getAttentionReason,
  riskLevelToScore,
  SUCCESS_BUCKETS,
} from "@/lib/portfolio/utils";

type ProjectWithLatest = {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "archived";
  isStarred: boolean;
  isPinned: boolean;
  updatedAt: Date;
  createdAt: Date;
  analyses: {
    successScore: number;
    riskLevel: string;
    complexity: string;
    createdAt: Date;
  }[];
  executiveReports: {
    reportData: unknown;
    investmentReadinessScore: number;
    createdAt: Date;
  }[];
};

function getReadinessFromReport(
  report: ProjectWithLatest["executiveReports"][0] | undefined
): number | null {
  if (!report) return null;
  const data = report.reportData as ExecutiveReportData;
  return calculateReadinessScore({
    investmentReadinessScore: report.investmentReadinessScore,
    projectReadinessScore: data.projectReadinessScore,
    executionReadinessScore: data.executionReadinessScore,
    teamReadinessScore: data.teamReadinessScore,
    launchReadinessScore: data.launchReadinessScore,
  });
}

function toPortfolioProject(project: ProjectWithLatest): PortfolioProject {
  const latestAnalysis = project.analyses[0] ?? null;
  const previousAnalysis = project.analyses[1] ?? null;
  const latestReport = project.executiveReports[0] ?? null;

  const successScore = latestAnalysis?.successScore ?? null;
  const riskLevel = (latestAnalysis?.riskLevel as RiskLevel) ?? null;
  const readinessScore = getReadinessFromReport(latestReport);
  const hasAnalysis = !!latestAnalysis;
  const hasReport = !!latestReport;

  const scoreChange =
    latestAnalysis && previousAnalysis
      ? latestAnalysis.successScore - previousAnalysis.successScore
      : null;

  const attentionReason = getAttentionReason(
    successScore,
    riskLevel,
    readinessScore,
    hasAnalysis
  );

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    isStarred: project.isStarred,
    isPinned: project.isPinned,
    successScore,
    riskLevel,
    readinessScore,
    complexity: (latestAnalysis?.complexity as RiskLevel) ?? null,
    hasAnalysis,
    hasReport,
    updatedAt: project.updatedAt.toISOString(),
    createdAt: project.createdAt.toISOString(),
    scoreChange,
    requiresAttention: attentionReason !== null,
  };
}

export async function getPortfolioProjects(
  userId: string
): Promise<PortfolioProject[]> {
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 2,
        select: {
          successScore: true,
          riskLevel: true,
          complexity: true,
          createdAt: true,
        },
      },
      executiveReports: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          reportData: true,
          investmentReadinessScore: true,
          createdAt: true,
        },
      },
    },
  });

  return projects.map(toPortfolioProject);
}

export async function analyzePortfolio(
  userId: string
): Promise<PortfolioAnalytics> {
  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 2,
        select: {
          successScore: true,
          riskLevel: true,
          complexity: true,
          createdAt: true,
        },
      },
      executiveReports: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          reportData: true,
          investmentReadinessScore: true,
          createdAt: true,
        },
      },
    },
  });

  const portfolioProjects = projects.map(toPortfolioProject);
  const analyzed = portfolioProjects.filter((p) => p.hasAnalysis);

  const avgSuccess =
    analyzed.length > 0
      ? analyzed.reduce((sum, p) => sum + (p.successScore ?? 0), 0) /
        analyzed.length
      : 0;

  const avgRisk =
    analyzed.length > 0
      ? analyzed.reduce((sum, p) => sum + riskLevelToScore(p.riskLevel), 0) /
        analyzed.length
      : 0;

  const withReadiness = portfolioProjects.filter(
    (p) => p.readinessScore !== null
  );
  const avgReadiness =
    withReadiness.length > 0
      ? withReadiness.reduce((sum, p) => sum + (p.readinessScore ?? 0), 0) /
        withReadiness.length
      : 0;

  const analyzedRatio =
    projects.length > 0 ? analyzed.length / projects.length : 0;

  const portfolioHealthScore = calculatePortfolioHealth(
    avgSuccess,
    avgRisk,
    avgReadiness,
    analyzedRatio
  );

  const sortedBySuccess = [...analyzed].sort(
    (a, b) => (b.successScore ?? 0) - (a.successScore ?? 0)
  );
  const highestPotential = sortedBySuccess[0]
    ? {
        id: sortedBySuccess[0].id,
        title: sortedBySuccess[0].title,
        successScore: sortedBySuccess[0].successScore!,
        readinessScore: sortedBySuccess[0].readinessScore,
      }
    : null;

  const highRisk = analyzed.filter((p) => p.riskLevel === "high");
  const mostAtRisk = highRisk.length
    ? highRisk.reduce((worst, p) =>
        (p.successScore ?? 100) < (worst.successScore ?? 100) ? p : worst
      )
    : analyzed.length
      ? analyzed.reduce((worst, p) =>
          riskLevelToScore(p.riskLevel) > riskLevelToScore(worst.riskLevel)
            ? p
            : worst
        )
      : null;

  const weakestProject = sortedBySuccess.length
    ? {
        id: sortedBySuccess[sortedBySuccess.length - 1].id,
        title: sortedBySuccess[sortedBySuccess.length - 1].title,
        successScore:
          sortedBySuccess[sortedBySuccess.length - 1].successScore!,
      }
    : null;

  const withChanges = analyzed.filter(
    (p) => p.scoreChange !== null && p.scoreChange !== 0
  );
  const mostImproved = withChanges.length
    ? withChanges.reduce((best, p) =>
        (p.scoreChange ?? 0) > (best.scoreChange ?? 0) ? p : best
      )
    : null;

  const projectsRequiringAttention = portfolioProjects
    .filter((p) => p.requiresAttention)
    .map((p) => ({
      id: p.id,
      title: p.title,
      reason:
        getAttentionReason(
          p.successScore,
          p.riskLevel,
          p.readinessScore,
          p.hasAnalysis
        ) ?? "Requires attention",
    }));

  const successDistribution = SUCCESS_BUCKETS.map((bucket) => ({
    range: bucket.range,
    count: analyzed.filter(
      (p) =>
        p.successScore !== null &&
        p.successScore >= bucket.min &&
        p.successScore <= bucket.max
    ).length,
  }));

  const riskLevels: RiskLevel[] = ["low", "medium", "high"];
  const riskDistribution = riskLevels.map((level) => ({
    level,
    count: analyzed.filter((p) => p.riskLevel === level).length,
  }));

  const statuses = ["draft", "active", "archived"] as const;
  const statusBreakdown = statuses.map((status) => ({
    status,
    count: portfolioProjects.filter((p) => p.status === status).length,
  }));

  const readinessTrends = buildReadinessTrends(projects);

  return {
    portfolioHealthScore,
    averageSuccessScore: Math.round(avgSuccess * 10) / 10,
    averageRiskScore: Math.round(avgRisk * 10) / 10,
    averageReadiness: Math.round(avgReadiness * 10) / 10,
    totalProjects: projects.length,
    analyzedProjects: analyzed.length,
    highestPotential,
    mostAtRisk: mostAtRisk
      ? {
          id: mostAtRisk.id,
          title: mostAtRisk.title,
          riskLevel: mostAtRisk.riskLevel!,
          successScore: mostAtRisk.successScore!,
        }
      : null,
    weakestProject,
    mostImproved: mostImproved
      ? {
          id: mostImproved.id,
          title: mostImproved.title,
          scoreChange: mostImproved.scoreChange!,
          currentScore: mostImproved.successScore!,
        }
      : null,
    projectsRequiringAttention,
    successDistribution,
    riskDistribution,
    statusBreakdown,
    readinessTrends,
  };
}

function buildReadinessTrends(
  projects: ProjectWithLatest[]
): { date: string; averageReadiness: number }[] {
  const dateMap = new Map<string, number[]>();

  for (const project of projects) {
    for (const report of project.executiveReports) {
      const date = report.createdAt.toISOString().split("T")[0];
      const readiness = getReadinessFromReport(report);
      if (readiness === null) continue;
      const existing = dateMap.get(date) ?? [];
      existing.push(readiness);
      dateMap.set(date, existing);
    }
  }

  return Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([date, scores]) => ({
      date,
      averageReadiness: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      ),
    }));
}

export function comparePortfolioGroups(
  projects: PortfolioProject[],
  groups: { name: string; projectIds: string[] }[]
) {
  return groups
    .map((group) => {
      const groupProjects = projects.filter((p) =>
        group.projectIds.includes(p.id)
      );
      const analyzed = groupProjects.filter((p) => p.hasAnalysis);

      const avgSuccess =
        analyzed.length > 0
          ? analyzed.reduce((s, p) => s + (p.successScore ?? 0), 0) /
            analyzed.length
          : 0;
      const avgRisk =
        analyzed.length > 0
          ? analyzed.reduce((s, p) => s + riskLevelToScore(p.riskLevel), 0) /
            analyzed.length
          : 0;
      const withReadiness = groupProjects.filter(
        (p) => p.readinessScore !== null
      );
      const avgReadiness =
        withReadiness.length > 0
          ? withReadiness.reduce((s, p) => s + (p.readinessScore ?? 0), 0) /
            withReadiness.length
          : 0;

      return {
        groupName: group.name,
        projectIds: group.projectIds,
        averageSuccess: Math.round(avgSuccess * 10) / 10,
        averageRisk: Math.round(avgRisk * 10) / 10,
        averageReadiness: Math.round(avgReadiness * 10) / 10,
        opportunityRank: 0,
        projectCount: groupProjects.length,
      };
    })
    .sort((a, b) => {
      const scoreA = a.averageSuccess * 0.5 + a.averageReadiness * 0.5;
      const scoreB = b.averageSuccess * 0.5 + b.averageReadiness * 0.5;
      return scoreB - scoreA;
    })
    .map((g, i) => ({ ...g, opportunityRank: i + 1 }));
}
