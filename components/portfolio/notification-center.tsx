"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import type { NotificationEntry } from "@/types/portfolio";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/lib/actions/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TYPE_COLORS: Record<string, string> = {
  risk_increased: "text-danger",
  team_readiness_dropped: "text-warning",
  project_more_viable: "text-success",
  launch_readiness_improved: "text-success",
  goal_progress: "text-primary",
  attention_required: "text-danger",
};

interface NotificationCenterProps {
  notifications: NotificationEntry[];
  unreadCount: number;
}

export function NotificationCenter({
  notifications,
  unreadCount,
}: NotificationCenterProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="default" className="h-5 px-1.5 text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllNotificationsReadAction()}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {notifications.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <Bell className="mx-auto mb-2 h-8 w-8 text-muted/40" />
              <p className="text-sm text-muted">No notifications yet</p>
            </div>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`rounded-lg border p-3 transition-colors ${
                notification.isRead
                  ? "border-transparent bg-transparent"
                  : "border-primary/20 bg-primary/5"
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
                      TYPE_COLORS[notification.type] ?? "text-foreground"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted line-clamp-2">
                    {notification.message}
                  </p>
                  {notification.projectTitle && (
                    <Link
                      href={`/projects/${notification.projectId}`}
                      className="mt-1 inline-block text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notification.projectTitle}
                    </Link>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted/70">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
