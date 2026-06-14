"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, X } from "lucide-react";
import type { NotificationEntry } from "@/types/portfolio";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/lib/actions/portfolio";
import { usePresentationStore } from "@/stores/presentation-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TYPE_COLORS: Record<string, string> = {
  risk_increased: "text-danger",
  team_readiness_dropped: "text-warning",
  project_more_viable: "text-success",
  launch_readiness_improved: "text-success",
  goal_progress: "text-primary",
  attention_required: "text-danger",
};

interface NotificationDrawerProps {
  notifications: NotificationEntry[];
  unreadCount: number;
}

export function NotificationDrawer({
  notifications,
  unreadCount,
}: NotificationDrawerProps) {
  const { notificationDrawerOpen, setNotificationDrawerOpen } =
    usePresentationStore();

  return (
    <AnimatePresence>
      {notificationDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setNotificationDrawerOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            role="dialog"
            aria-label="Notifications"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <Badge variant="default" className="h-5 px-1.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllNotificationsReadAction()}
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span className="sr-only">Mark all read</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationDrawerOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {notifications.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Bell className="mb-3 h-10 w-10 text-muted/30" />
                  <p className="text-sm font-medium text-foreground">
                    All caught up
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    New alerts will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        notification.isRead
                          ? "border-transparent hover:bg-surface"
                          : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          markNotificationReadAction(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium ${
                              TYPE_COLORS[notification.type] ??
                              "text-foreground"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.projectTitle && notification.projectId && (
                            <Link
                              href={`/projects/${notification.projectId}`}
                              className="mt-1 inline-block text-xs text-primary hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setNotificationDrawerOpen(false);
                              }}
                            >
                              {notification.projectTitle}
                            </Link>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-muted/70">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
