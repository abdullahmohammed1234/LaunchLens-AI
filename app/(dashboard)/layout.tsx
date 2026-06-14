import { auth } from "@/auth";
import { getProjectsForUser } from "@/lib/auth-utils";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/lib/portfolio/notifications";
import { AppShell } from "@/components/layout/app-shell";
import { PlatformFeatures } from "@/components/layout/platform-features";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session!.user.id;

  const [projects, notifications, unreadCount] = await Promise.all([
    getProjectsForUser(userId),
    getNotifications(userId, 30),
    getUnreadNotificationCount(userId),
  ]);

  const projectOptions = projects.map((p) => ({
    id: p.id,
    title: p.title,
  }));

  return (
    <PlatformFeatures
      projects={projectOptions}
      notifications={notifications}
      unreadCount={unreadCount}
    >
      <AppShell>{children}</AppShell>
    </PlatformFeatures>
  );
}
