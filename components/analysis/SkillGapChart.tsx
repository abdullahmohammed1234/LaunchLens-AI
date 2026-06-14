"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { SkillGap } from "@/lib/validations/analysis";
import {
  groupByLevel,
  importanceToValue,
  levelAccentClass,
  levelToBadgeVariant,
  sortSkillGapsByImportance,
} from "@/lib/utils/analysis";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillGapChartProps {
  skillGaps: SkillGap[];
  loading?: boolean;
  index?: number;
  className?: string;
}

const LEVEL_ORDER = ["high", "medium", "low"] as const;
const LEVEL_LABELS = {
  high: "Critical Skills",
  medium: "Important Skills",
  low: "Nice to Have",
};

function SkillProgressBar({
  gap,
  barIndex,
}: {
  gap: SkillGap;
  barIndex: number;
}) {
  const value = importanceToValue(gap.importance);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-foreground">{gap.skill}</span>
        <Badge variant={levelToBadgeVariant(gap.importance)}>
          {gap.importance}
        </Badge>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border/60">
        <motion.div
          className={cn(
            "h-full rounded-full",
            gap.importance === "high"
              ? "bg-danger"
              : gap.importance === "medium"
                ? "bg-warning"
                : "bg-success"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: barIndex * 0.05 }}
        />
      </div>
    </div>
  );
}

export function SkillGapChart({
  skillGaps,
  loading = false,
  index = 0,
  className,
}: SkillGapChartProps) {
  const sorted = sortSkillGapsByImportance(skillGaps);
  const grouped = groupByLevel(sorted, "importance");
  const radarData = sorted.slice(0, 6).map((gap) => ({
    skill:
      gap.skill.length > 14 ? `${gap.skill.slice(0, 14)}…` : gap.skill,
    value: importanceToValue(gap.importance),
    fullMark: 100,
  }));

  if (loading) {
    return (
      <Card className={cn("border-border bg-card", className)}>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="mx-auto h-48 w-full max-w-xs rounded-lg" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  let barIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        className={cn(
          "border-border bg-card transition-all duration-300 hover:border-primary/20",
          className
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Skill Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {radarData.length >= 3 && (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#27272A" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "#A1A1AA", fontSize: 11 }}
                  />
                  <Radar
                    name="Importance"
                    dataKey="value"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="space-y-5">
            {LEVEL_ORDER.map((level) => {
              const gaps = grouped[level];
              if (gaps.length === 0) return null;

              return (
                <div key={level}>
                  <p
                    className={cn(
                      "mb-3 text-xs font-semibold uppercase tracking-wide",
                      levelAccentClass(level)
                    )}
                  >
                    {LEVEL_LABELS[level]}
                  </p>
                  <div className="space-y-3">
                    {gaps.map((gap) => {
                      const current = barIndex++;
                      return (
                        <SkillProgressBar
                          key={`${gap.skill}-${level}`}
                          gap={gap}
                          barIndex={current}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
