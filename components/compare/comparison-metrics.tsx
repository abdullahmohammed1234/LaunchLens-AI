"use client";

import { motion } from "framer-motion";
import {
  Award,
  Clock,
  Layers,
  Shield,
  Target,
  Users,
} from "lucide-react";
import type { MetricHighlights, ProjectScore } from "@/types/project-comparison";
import { getProjectTitle } from "@/lib/utils/project-comparison";
import { StatCard } from "@/components/dashboard/stat-card";

interface ComparisonMetricsProps {
  highlights: MetricHighlights;
  projectScores: ProjectScore[];
  projectTitles: Record<string, string>;
}

export function ComparisonMetrics({
  highlights,
  projectScores,
  projectTitles,
}: ComparisonMetricsProps) {
  const winnerScore = projectScores.find(
    (s) => s.projectId === highlights.bestOverall
  );

  const metrics = [
    {
      label: "Best Overall Project",
      value: getProjectTitle(highlights.bestOverall, projectTitles),
      icon: Award,
      sub: winnerScore ? `${winnerScore.overallScore}/100` : undefined,
    },
    {
      label: "Highest Success Score",
      value: getProjectTitle(highlights.highestSuccess, projectTitles),
      icon: Target,
    },
    {
      label: "Lowest Risk",
      value: getProjectTitle(highlights.lowestRisk, projectTitles),
      icon: Shield,
    },
    {
      label: "Fastest Launch",
      value: getProjectTitle(highlights.fastestLaunch, projectTitles),
      icon: Clock,
    },
    {
      label: "Lowest Complexity",
      value: getProjectTitle(highlights.lowestComplexity, projectTitles),
      icon: Layers,
    },
    {
      label: "Best Skill Fit",
      value: getProjectTitle(highlights.bestSkillFit, projectTitles),
      icon: Users,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      {metrics.map((metric, index) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={
            metric.value.length > 18
              ? `${metric.value.slice(0, 16)}…`
              : metric.value
          }
          change={metric.sub}
          icon={metric.icon}
          index={index}
          className="[&_p:nth-child(2)]:text-lg [&_p:nth-child(2)]:font-semibold"
        />
      ))}
    </motion.div>
  );
}
