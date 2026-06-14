"use client";

import { motion } from "framer-motion";
import { Users, UserPlus } from "lucide-react";
import type { TeamComparisonEntry } from "@/types/project-comparison";
import {
  getProjectTitle,
  levelToBadgeVariant,
} from "@/lib/utils/project-comparison";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamComparisonProps {
  teams: TeamComparisonEntry[];
  projectTitles: Record<string, string>;
}

export function TeamComparison({
  teams,
  projectTitles,
}: TeamComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Team Comparison
          </CardTitle>
          <p className="text-xs text-muted">
            Team size, critical roles, skill gaps, and hiring difficulty
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, index) => (
              <motion.div
                key={team.projectId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                className="rounded-xl border border-border bg-surface/30 p-5"
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {getProjectTitle(team.projectId, projectTitles)}
                  </p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <UserPlus className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <p className="mt-3 text-3xl font-bold text-foreground">
                  {team.teamSize}
                  <span className="ml-1 text-sm font-normal text-muted">
                    members
                  </span>
                </p>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-foreground">
                    Critical Roles
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {team.criticalRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-[10px]">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted">Skill Gaps</p>
                    <p className="text-sm font-semibold text-foreground">
                      {team.skillGapCount} identified
                    </p>
                  </div>
                  <Badge variant={levelToBadgeVariant(team.skillGapSeverity)}>
                    {team.skillGapSeverity}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-muted">Hiring Difficulty</p>
                  <Badge variant={levelToBadgeVariant(team.hiringDifficulty)}>
                    {team.hiringDifficulty}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
