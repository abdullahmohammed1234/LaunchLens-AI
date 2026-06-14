import {
  analyzePortfolio,
  getPortfolioProjects,
} from "@/lib/portfolio/analyzePortfolio";
import { getRecentActivity } from "@/lib/portfolio/activity";
import { getGoalsForUser } from "@/lib/portfolio/goals";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/lib/portfolio/notifications";
import type { FounderDashboardData } from "@/types/portfolio";

export async function getFounderDashboardData(
  userId: string
): Promise<FounderDashboardData> {
  const [
    analytics,
    projects,
    recentActivity,
    goals,
    notifications,
    unreadNotificationCount,
  ] = await Promise.all([
    analyzePortfolio(userId),
    getPortfolioProjects(userId),
    getRecentActivity(userId, 8),
    getGoalsForUser(userId),
    getNotifications(userId, 5),
    getUnreadNotificationCount(userId),
  ]);

  const watchlist = projects
    .filter((p) => p.isStarred || p.isPinned)
    .slice(0, 6);

  return {
    analytics,
    recentActivity,
    watchlist,
    goals: goals.filter((g) => !g.isCompleted).slice(0, 5),
    notifications,
    unreadNotificationCount,
  };
}
