"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  FileText,
  FlaskConical,
  FolderPlus,
  GitBranch,
  Map as MapIcon,
  Target,
  Users,
  Filter,
} from "lucide-react";
import type { ActivityLogEntry } from "@/types/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EMPTY_STATES } from "@/lib/constants/empty-states";
import { EmptyState } from "@/components/ui/empty-state";

const ACTIVITY_ICONS: Record<string, typeof BarChart3> = {
  project_created: FolderPlus,
  project_updated: FolderPlus,
  project_analyzed: BarChart3,
  simulation_generated: FlaskConical,
  roadmap_updated: MapIcon,
  team_plan_created: Users,
  report_generated: FileText,
  snapshot_created: GitBranch,
  goal_created: Target,
  goal_completed: Target,
};

const ACTIVITY_FILTERS = [
  { id: "all", label: "All" },
  { id: "project_analyzed", label: "Analysis" },
  { id: "simulation_generated", label: "Simulation" },
  { id: "roadmap_updated", label: "Roadmap" },
  { id: "team_plan_created", label: "Team" },
  { id: "report_generated", label: "Reports" },
] as const;

function getGroupLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return "Earlier";
}

function groupActivities(activities: ActivityLogEntry[]) {
  const groups = new Map<string, ActivityLogEntry[]>();

  for (const activity of activities) {
    const label = getGroupLabel(new Date(activity.createdAt));
    const existing = groups.get(label) ?? [];
    existing.push(activity);
    groups.set(label, existing);
  }

  return Array.from(groups.entries());
}

interface ActivityFeedProps {
  activities: ActivityLogEntry[];
  limit?: number;
}

export function ActivityFeed({ activities, limit }: ActivityFeedProps) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const items = limit ? activities.slice(0, limit) : activities;
    if (filter === "all") return items;
    return items.filter((a) => a.type === filter);
  }, [activities, limit, filter]);

  const grouped = useMemo(() => groupActivities(filtered), [filtered]);

  if (activities.length === 0) {
    const config = EMPTY_STATES.activity;
    return (
      <EmptyState
        icon={config.icon}
        title={config.title}
        description={config.description}
        action={{ label: config.actionLabel, href: config.actionHref }}
        className="border-solid bg-card"
      />
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg">Activity</CardTitle>
        <div className="flex flex-wrap gap-1">
          {ACTIVITY_FILTERS.map((f) => (
            <Button
              key={f.id}
              variant={filter === f.id ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setFilter(f.id)}
            >
              {f.id === "all" && <Filter className="mr-1 h-3 w-3" />}
              {f.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="popLayout">
          {grouped.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No activities match this filter
            </p>
          ) : (
            grouped.map(([groupLabel, groupItems]) => (
              <div key={groupLabel}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  {groupLabel}
                </p>
                <div className="space-y-1">
                  {groupItems.map((activity, index) => {
                    const Icon = ACTIVITY_ICONS[activity.type] ?? BarChart3;
                    return (
                      <motion.div
                        key={activity.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-surface"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {activity.title}
                          </p>
                          {activity.description && (
                            <p className="text-xs text-muted line-clamp-1">
                              {activity.description}
                            </p>
                          )}
                          <time
                            className="mt-0.5 block text-xs text-muted/70"
                            dateTime={activity.createdAt}
                          >
                            {formatDistanceToNow(new Date(activity.createdAt), {
                              addSuffix: true,
                            })}
                          </time>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
