"use client";

import { motion } from "framer-motion";
import { Map, CheckCircle2 } from "lucide-react";
import type { RoadmapComparisonEntry } from "@/types/project-comparison";
import {
  getProjectTitle,
  levelToBadgeVariant,
} from "@/lib/utils/project-comparison";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoadmapComparisonProps {
  roadmaps: RoadmapComparisonEntry[];
  projectTitles: Record<string, string>;
}

export function RoadmapComparison({
  roadmaps,
  projectTitles,
}: RoadmapComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Map className="h-5 w-5 text-primary" />
            Roadmap Comparison
          </CardTitle>
          <p className="text-xs text-muted">
            Execution timeline, scope, and launch readiness
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap.projectId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.08 }}
                className="rounded-xl border border-border bg-surface/30 p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {getProjectTitle(roadmap.projectId, projectTitles)}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {roadmap.durationMonths}
                    </p>
                    <p className="text-xs text-muted">Months</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {roadmap.milestoneCount}
                    </p>
                    <p className="text-xs text-muted">Milestones</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {roadmap.taskCount}
                    </p>
                    <p className="text-xs text-muted">Tasks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {roadmap.launchReadiness}%
                    </p>
                    <p className="text-xs text-muted">Readiness</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant={levelToBadgeVariant(roadmap.executionDifficulty)}>
                    {roadmap.executionDifficulty} difficulty
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <CheckCircle2 className="h-3 w-3" />
                    Launch ready
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/60">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${roadmap.launchReadiness}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.08 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
