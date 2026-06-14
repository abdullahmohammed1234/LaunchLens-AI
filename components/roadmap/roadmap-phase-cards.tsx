"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Clock,
  Flag,
  Circle,
} from "lucide-react";
import type { RoadmapPhase } from "@/types/roadmap";
import { getPhaseStatus } from "@/lib/utils/roadmap";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoadmapPhaseCardsProps {
  phases: RoadmapPhase[];
}

export function RoadmapPhaseCards({ phases }: RoadmapPhaseCardsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Execution Phases
      </h2>
      {phases.map((phase, index) => {
        const status = getPhaseStatus(index, phases.length);
        const isExpanded = expandedIndex === index;
        const completedTasks = 0;
        const totalTasks = phase.tasks.length;
        const progress =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return (
          <motion.div
            key={phase.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card
              className={cn(
                "cursor-pointer border-border bg-card transition-all",
                status === "current" && "border-primary/30",
                isExpanded && "ring-1 ring-primary/20"
              )}
              onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                      status === "current"
                        ? "bg-primary text-white"
                        : "border border-border bg-surface text-muted"
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-base">{phase.title}</CardTitle>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                      <Clock className="h-3 w-3" />
                      {phase.durationWeeks} weeks
                      <span className="text-border">·</span>
                      {phase.milestones.length} milestones
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status === "current" && (
                    <Badge variant="default">Current</Badge>
                  )}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted" />
                  </motion.div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-muted">{phase.description}</p>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>Phase progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4 border-t border-border pt-4">
                        <div>
                          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
                            <Flag className="h-3 w-3" />
                            Milestones
                          </h4>
                          <div className="space-y-2">
                            {phase.milestones.map((milestone) => (
                              <div
                                key={milestone.title}
                                className="rounded-lg border border-border bg-surface/50 p-3"
                              >
                                <p className="text-sm font-medium text-foreground">
                                  {milestone.title}
                                </p>
                                <p className="mt-0.5 text-xs text-muted">
                                  {milestone.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                            Key Tasks
                          </h4>
                          <div className="space-y-2">
                            {phase.tasks.slice(0, 5).map((task) => (
                              <div
                                key={task.title}
                                className="flex items-center gap-2 rounded-lg border border-border bg-surface/30 p-2.5"
                              >
                                <Circle className="h-4 w-4 shrink-0 text-muted" />
                                <span className="flex-1 text-sm text-foreground">
                                  {task.title}
                                </span>
                                <Badge
                                  variant={
                                    task.priority === "high"
                                      ? "danger"
                                      : task.priority === "medium"
                                        ? "warning"
                                        : "secondary"
                                  }
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                            ))}
                            {phase.tasks.length > 5 && (
                              <p className="text-xs text-muted">
                                +{phase.tasks.length - 5} more tasks in Kanban
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
