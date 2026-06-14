import { prisma } from "@/lib/prisma";
import type { ActivityType } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { ActivityLogEntry } from "@/types/portfolio";

export async function logActivity(params: {
  userId: string;
  projectId?: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.activityLog.create({
    data: {
      userId: params.userId,
      projectId: params.projectId,
      type: params.type,
      title: params.title,
      description: params.description,
      metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function getRecentActivity(
  userId: string,
  limit = 10
): Promise<ActivityLogEntry[]> {
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      project: { select: { title: true } },
    },
  });

  return logs.map((log) => ({
    id: log.id,
    type: log.type,
    title: log.title,
    description: log.description,
    projectId: log.projectId,
    projectTitle: log.project?.title ?? null,
    createdAt: log.createdAt.toISOString(),
  }));
}
