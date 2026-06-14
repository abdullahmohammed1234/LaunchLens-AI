"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { createProjectSnapshot } from "@/lib/portfolio/snapshots";
import {
  createGoal,
  deleteGoal,
  updateGoalProgress,
} from "@/lib/portfolio/goals";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/portfolio/notifications";
import { createGoalSchema } from "@/types/portfolio";

export async function toggleProjectStarAction(projectId: string) {
  const session = await requireAuth();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) throw new Error("Project not found");

  await prisma.project.update({
    where: { id: projectId },
    data: { isStarred: !project.isStarred },
  });

  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
  return { isStarred: !project.isStarred };
}

export async function toggleProjectPinAction(projectId: string) {
  const session = await requireAuth();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) throw new Error("Project not found");

  await prisma.project.update({
    where: { id: projectId },
    data: { isPinned: !project.isPinned },
  });

  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
  return { isPinned: !project.isPinned };
}

export async function createSnapshotAction(
  projectId: string,
  label?: string
) {
  const session = await requireAuth();
  const snapshot = await createProjectSnapshot(
    session.user.id,
    projectId,
    label
  );
  revalidatePath(`/portfolio/${projectId}/evolution`);
  revalidatePath("/portfolio");
  return snapshot;
}

export async function createGoalAction(input: unknown) {
  const session = await requireAuth();
  const data = createGoalSchema.parse(input);
  const goal = await createGoal(session.user.id, data);
  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
  return goal;
}

export async function updateGoalProgressAction(
  goalId: string,
  currentValue: number
) {
  const session = await requireAuth();
  const goal = await updateGoalProgress(
    session.user.id,
    goalId,
    currentValue
  );
  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
  return goal;
}

export async function deleteGoalAction(goalId: string) {
  const session = await requireAuth();
  await deleteGoal(session.user.id, goalId);
  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
}

export async function markNotificationReadAction(notificationId: string) {
  const session = await requireAuth();
  await markNotificationRead(session.user.id, notificationId);
  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
}

export async function markAllNotificationsReadAction() {
  const session = await requireAuth();
  await markAllNotificationsRead(session.user.id);
  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
}
