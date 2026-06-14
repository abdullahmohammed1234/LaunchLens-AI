"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  BarChart3,
  Camera,
  FileText,
  FlaskConical,
  Map,
  Users,
} from "lucide-react";
import type { EvolutionEvent } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";

const EVENT_ICONS: Record<string, typeof BarChart3> = {
  analysis: BarChart3,
  simulation: FlaskConical,
  roadmap: Map,
  team_plan: Users,
  report: FileText,
  snapshot: Camera,
};

const EVENT_COLORS: Record<string, string> = {
  analysis: "border-primary/40 bg-primary/5",
  simulation: "border-danger/40 bg-danger/5",
  roadmap: "border-emerald-500/40 bg-emerald-500/5",
  team_plan: "border-cyan-500/40 bg-cyan-500/5",
  report: "border-violet-500/40 bg-violet-500/5",
  snapshot: "border-muted bg-surface",
};

interface EvolutionTimelineProps {
  events: EvolutionEvent[];
}

export function EvolutionTimeline({ events }: EvolutionTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
        <p className="text-sm text-muted">No evolution history yet</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border" />
      {events.map((event, index) => {
        const Icon = EVENT_ICONS[event.type] ?? BarChart3;
        const colorClass = EVENT_COLORS[event.type] ?? EVENT_COLORS.snapshot;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex gap-4 pb-6"
          >
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${colorClass}`}
            >
              <Icon className="h-4 w-4 text-foreground" />
            </div>
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{event.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {format(new Date(event.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              {event.changes && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {event.changes.successScoreDelta !== null &&
                    event.changes.successScoreDelta !== 0 && (
                      <Badge
                        variant={
                          event.changes.successScoreDelta > 0
                            ? "success"
                            : "danger"
                        }
                      >
                        Score {event.changes.successScoreDelta > 0 ? "+" : ""}
                        {event.changes.successScoreDelta}
                      </Badge>
                    )}
                  {event.changes.riskLevelChange && (
                    <Badge variant="warning">
                      Risk: {event.changes.riskLevelChange}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
