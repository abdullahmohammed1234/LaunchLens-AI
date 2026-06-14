"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { SkillReadiness, TeamSkillGap } from "@/types/team-plan";
import {
  categoryAccentClass,
  categoryLabel,
  groupSkillGapsByCategory,
  severityToBadgeVariant,
} from "@/lib/utils/team-plan";
import type { TeamPlan } from "@/types/team-plan";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillGapIntelligenceProps {
  teamPlan: TeamPlan;
}

const CATEGORY_ORDER = ["critical", "important", "optional"] as const;

function ReadinessBar({
  skill,
  index,
}: {
  skill: SkillReadiness;
  index: number;
}) {
  const gap = Math.max(0, skill.requiredLevel - skill.currentLevel);
  const readiness = Math.max(0, 100 - gap);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-foreground">{skill.skill}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">
            {skill.currentLevel}% → {skill.requiredLevel}%
          </span>
          <Badge variant={severityToBadgeVariant(
            readiness >= 70 ? "low" : readiness >= 40 ? "medium" : "high"
          )}>
            {readiness}%
          </Badge>
        </div>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-border/60">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-muted/40"
          initial={{ width: 0 }}
          animate={{ width: `${skill.requiredLevel}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
        />
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            readiness >= 70
              ? "bg-success"
              : readiness >= 40
                ? "bg-warning"
                : "bg-danger"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${skill.currentLevel}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
        />
      </div>
    </div>
  );
}

function SkillGapItem({
  gap,
  index,
}: {
  gap: TeamSkillGap;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-lg border border-border bg-surface/50 p-3"
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{gap.skill}</span>
        <Badge variant={severityToBadgeVariant(gap.severity)}>
          {gap.severity}
        </Badge>
      </div>
      <p className="text-xs leading-relaxed text-muted">{gap.reason}</p>
    </motion.div>
  );
}

export function SkillGapIntelligence({ teamPlan }: SkillGapIntelligenceProps) {
  const grouped = groupSkillGapsByCategory(teamPlan);
  const radarData = teamPlan.skillReadiness.slice(0, 6).map((skill) => ({
    skill:
      skill.skill.length > 14 ? `${skill.skill.slice(0, 14)}…` : skill.skill,
    current: skill.currentLevel,
    required: skill.requiredLevel,
    fullMark: 100,
  }));

  let barIndex = 0;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Skill Gap Intelligence
      </h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Current vs Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {radarData.length >= 3 && (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={radarData}
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                    >
                      <PolarGrid stroke="#27272A" />
                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: "#A1A1AA", fontSize: 11 }}
                      />
                      <Radar
                        name="Required"
                        dataKey="required"
                        stroke="#6366F1"
                        fill="#6366F1"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                      />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#22C55E"
                        fill="#22C55E"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-4">
                {teamPlan.skillReadiness.map((skill) => {
                  const current = barIndex++;
                  return (
                    <ReadinessBar key={skill.skill} skill={skill} index={current} />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Identified Skill Gaps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {CATEGORY_ORDER.map((category) => {
                const gaps = grouped[category];
                if (gaps.length === 0) return null;

                return (
                  <div key={category}>
                    <p
                      className={cn(
                        "mb-3 text-xs font-semibold uppercase tracking-wide",
                        categoryAccentClass(category)
                      )}
                    >
                      {categoryLabel(category)}
                    </p>
                    <div className="space-y-2">
                      {gaps.map((gap, i) => (
                        <SkillGapItem key={gap.skill} gap={gap} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
