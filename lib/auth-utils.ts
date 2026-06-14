import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Project } from "@prisma/client";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  return session;
}

export async function getProjectForUser(
  projectId: string,
  userId: string
): Promise<Project> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return project;
}

export async function getProjectsForUser(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getLatestAnalysisForProject(projectId: string) {
  return prisma.analysis.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestFailureSimulationForProject(projectId: string) {
  return prisma.failureSimulation.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestRoadmapForProject(projectId: string) {
  return prisma.roadmap.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestTeamPlanForProject(projectId: string) {
  return prisma.teamPlan.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestExecutiveReportForProject(projectId: string) {
  return prisma.executiveReport.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getExecutiveReportsForProject(projectId: string) {
  return prisma.executiveReport.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestComparisonForProject(
  userId: string,
  projectId: string
) {
  const comparisons = await prisma.projectComparison.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return comparisons.find((c) => {
    const ids = c.projectIds as string[];
    return ids.includes(projectId);
  });
}

export async function getExecutiveReportForUser(
  reportId: string,
  userId: string
) {
  const report = await prisma.executiveReport.findFirst({
    where: {
      id: reportId,
      project: { userId },
    },
    include: { project: true },
  });

  if (!report) {
    throw new NotFoundError("Report not found");
  }

  return report;
}

export async function getDashboardStats(userId: string) {
  const [total, active, draft, recentProjects] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.project.count({ where: { userId, status: "active" } }),
    prisma.project.count({ where: { userId, status: "draft" } }),
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return { total, active, draft, recentProjects };
}
