"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import type { RoadmapPhase } from "@/types/roadmap";
import { flattenMilestones } from "@/lib/utils/roadmap";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MilestoneTrackerProps {
  phases: RoadmapPhase[];
}

function StatusIcon({ status }: { status: "completed" | "in_progress" | "upcoming" }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case "in_progress":
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    default:
      return <Circle className="h-5 w-5 text-muted/50" />;
  }
}

export function MilestoneTracker({ phases }: MilestoneTrackerProps) {
  const milestones = flattenMilestones(phases);
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent =
    milestones.length > 0
      ? Math.round((completedCount / milestones.length) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Milestone Tracker
        </h2>
        <span className="text-sm text-muted">
          {completedCount}/{milestones.length} complete
        </span>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted">
            Timeline Progress
          </CardTitle>
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>Overall milestone progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border/60">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-success"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(progressPercent, 5)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-[10px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={`${milestone.phaseIndex}-${milestone.milestoneIndex}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex gap-4 pl-0"
                >
                  <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center bg-card">
                    <StatusIcon status={milestone.status} />
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          milestone.status === "completed"
                            ? "text-muted line-through"
                            : "text-foreground"
                        )}
                      >
                        {milestone.title}
                      </p>
                      {milestone.status === "in_progress" && (
                        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {milestone.description}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted/70">
                      <Clock className="h-3 w-3" />
                      {milestone.phaseTitle}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
