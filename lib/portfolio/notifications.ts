import { prisma } from "@/lib/prisma";
import type { NotificationType, Prisma } from "@prisma/client";
import type { NotificationEntry } from "@/types/portfolio";

export async function createNotification(params: {
  userId: string;
  projectId?: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      projectId: params.projectId,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function getNotifications(
  userId: string,
  limit = 20
): Promise<NotificationEntry[]> {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { project: { select: { title: true } } },
  });

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    projectId: n.projectId,
    projectTitle: n.project?.title ?? null,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function markNotificationRead(
  userId: string,
  notificationId: string
) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

type Level = "low" | "medium" | "high";

const levelOrder: Record<Level, number> = { low: 0, medium: 1, high: 2 };

export async function checkAndNotifyScoreChanges(params: {
  userId: string;
  projectId: string;
  projectTitle: string;
  previousSuccessScore?: number | null;
  currentSuccessScore: number;
  previousRiskLevel?: string | null;
  currentRiskLevel: string;
  previousReadiness?: number | null;
  currentReadiness?: number | null;
}) {
  const {
    userId,
    projectId,
    projectTitle,
    previousSuccessScore,
    currentSuccessScore,
    previousRiskLevel,
    currentRiskLevel,
    previousReadiness,
    currentReadiness,
  } = params;

  const notifications: Promise<unknown>[] = [];

  if (
    previousRiskLevel &&
    levelOrder[currentRiskLevel as Level] > levelOrder[previousRiskLevel as Level]
  ) {
    notifications.push(
      createNotification({
        userId,
        projectId,
        type: "risk_increased",
        title: "Risk increased",
        message: `${projectTitle}: risk level moved from ${previousRiskLevel} to ${currentRiskLevel}. Review your mitigation plan.`,
      })
    );
  }

  if (
    previousSuccessScore !== null &&
    previousSuccessScore !== undefined &&
    currentSuccessScore - previousSuccessScore >= 10
  ) {
    notifications.push(
      createNotification({
        userId,
        projectId,
        type: "project_more_viable",
        title: "Project became more viable",
        message: `${projectTitle}: success score improved by ${currentSuccessScore - previousSuccessScore} points to ${currentSuccessScore}.`,
      })
    );
  }

  if (
    previousReadiness !== null &&
    previousReadiness !== undefined &&
    currentReadiness !== null &&
    currentReadiness !== undefined &&
    currentReadiness - previousReadiness >= 8
  ) {
    notifications.push(
      createNotification({
        userId,
        projectId,
        type: "launch_readiness_improved",
        title: "Launch readiness improved",
        message: `${projectTitle}: readiness score increased to ${currentReadiness}.`,
      })
    );
  }

  if (
    previousReadiness !== null &&
    previousReadiness !== undefined &&
    currentReadiness !== null &&
    currentReadiness !== undefined &&
    previousReadiness - currentReadiness >= 8
  ) {
    notifications.push(
      createNotification({
        userId,
        projectId,
        type: "team_readiness_dropped",
        title: "Readiness declined",
        message: `${projectTitle}: readiness dropped from ${previousReadiness} to ${currentReadiness}.`,
      })
    );
  }

  if (currentSuccessScore < 40 && (previousSuccessScore ?? 100) >= 40) {
    notifications.push(
      createNotification({
        userId,
        projectId,
        type: "attention_required",
        title: "Project needs attention",
        message: `${projectTitle}: success score fell below 40. Consider re-running analysis or adjusting strategy.`,
      })
    );
  }

  await Promise.all(notifications);
}
