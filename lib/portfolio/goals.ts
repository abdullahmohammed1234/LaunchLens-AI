import { prisma } from "@/lib/prisma";
import type { GoalType } from "@prisma/client";
import type { CreateGoalInput, GoalEntry } from "@/types/portfolio";
import { logActivity } from "@/lib/portfolio/activity";
import { createNotification } from "@/lib/portfolio/notifications";

function calculateGoalProgress(
  targetValue: number | null,
  currentValue: number
): number {
  if (!targetValue || targetValue <= 0) return currentValue > 0 ? 100 : 0;
  return Math.min(100, Math.round((currentValue / targetValue) * 100));
}

export async function getGoalsForUser(userId: string): Promise<GoalEntry[]> {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: [{ isCompleted: "asc" }, { createdAt: "desc" }],
    include: { project: { select: { title: true } } },
  });

  return goals.map((g) => ({
    id: g.id,
    projectId: g.projectId,
    projectTitle: g.project?.title ?? null,
    type: g.type,
    title: g.title,
    description: g.description,
    targetValue: g.targetValue,
    currentValue: g.currentValue,
    targetDate: g.targetDate?.toISOString() ?? null,
    isCompleted: g.isCompleted,
    progress: calculateGoalProgress(g.targetValue, g.currentValue),
    createdAt: g.createdAt.toISOString(),
  }));
}

export async function createGoal(
  userId: string,
  input: CreateGoalInput
): Promise<GoalEntry> {
  const goal = await prisma.goal.create({
    data: {
      userId,
      projectId: input.projectId,
      type: input.type as GoalType,
      title: input.title,
      description: input.description,
      targetValue: input.targetValue,
      targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
    },
    include: { project: { select: { title: true } } },
  });

  await logActivity({
    userId,
    projectId: input.projectId,
    type: "goal_created",
    title: `Goal created: ${input.title}`,
  });

  return {
    id: goal.id,
    projectId: goal.projectId,
    projectTitle: goal.project?.title ?? null,
    type: goal.type,
    title: goal.title,
    description: goal.description,
    targetValue: goal.targetValue,
    currentValue: goal.currentValue,
    targetDate: goal.targetDate?.toISOString() ?? null,
    isCompleted: goal.isCompleted,
    progress: calculateGoalProgress(goal.targetValue, goal.currentValue),
    createdAt: goal.createdAt.toISOString(),
  };
}

export async function updateGoalProgress(
  userId: string,
  goalId: string,
  currentValue: number
) {
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
  });
  if (!goal) return null;

  const isCompleted =
    goal.targetValue !== null ? currentValue >= goal.targetValue : false;

  const updated = await prisma.goal.update({
    where: { id: goalId },
    data: { currentValue, isCompleted },
    include: { project: { select: { title: true } } },
  });

  if (isCompleted && !goal.isCompleted) {
    await logActivity({
      userId,
      projectId: goal.projectId ?? undefined,
      type: "goal_completed",
      title: `Goal completed: ${goal.title}`,
    });
    await createNotification({
      userId,
      projectId: goal.projectId ?? undefined,
      type: "goal_progress",
      title: "Goal achieved",
      message: `You reached your goal: ${goal.title}`,
    });
  }

  return {
    id: updated.id,
    projectId: updated.projectId,
    projectTitle: updated.project?.title ?? null,
    type: updated.type,
    title: updated.title,
    description: updated.description,
    targetValue: updated.targetValue,
    currentValue: updated.currentValue,
    targetDate: updated.targetDate?.toISOString() ?? null,
    isCompleted: updated.isCompleted,
    progress: calculateGoalProgress(updated.targetValue, updated.currentValue),
    createdAt: updated.createdAt.toISOString(),
  };
}

export async function deleteGoal(userId: string, goalId: string) {
  return prisma.goal.deleteMany({
    where: { id: goalId, userId },
  });
}

export async function syncGoalProgressFromProject(
  userId: string,
  projectId: string,
  readinessScore: number | null,
  successScore: number | null,
  riskLevel: string | null
) {
  const goals = await prisma.goal.findMany({
    where: { userId, projectId, isCompleted: false },
  });

  for (const goal of goals) {
    let newValue = goal.currentValue;
    switch (goal.type) {
      case "readiness_score":
        if (readinessScore !== null) newValue = readinessScore;
        break;
      case "risk_reduction":
        if (riskLevel === "low") newValue = 100;
        else if (riskLevel === "medium") newValue = 50;
        else if (riskLevel === "high") newValue = 20;
        break;
      case "launch_mvp":
        if (successScore !== null) newValue = successScore;
        break;
    }
    if (newValue !== goal.currentValue) {
      await updateGoalProgress(userId, goal.id, newValue);
    }
  }
}
