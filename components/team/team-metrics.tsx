"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Brain,
  Target,
  UserCheck,
  Users,
} from "lucide-react";
import type { TeamPlan } from "@/types/team-plan";
import {
  computeFounderReadiness,
  computeTeamRiskScore,
  countCriticalRoles,
} from "@/lib/utils/team-plan";
import { useAnimatedNumber } from "@/lib/hooks/use-animated-number";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMetricsProps {
  teamPlan: TeamPlan;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  index: number;
  animateValue?: boolean;
  suffix?: string;
  valueClassName?: string;
}

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  index,
  animateValue = false,
  suffix = "",
  valueClassName,
}: MetricCardProps) {
  const numericValue = typeof value === "number" ? value : 0;
  const animatedValue = useAnimatedNumber(numericValue, 1.2, animateValue);
  const displayValue = animateValue ? animatedValue : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="border-border bg-card transition-all hover:border-primary/30">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted">{label}</span>
          </div>
          <p
            className={cn(
              "text-xl font-bold tracking-tight text-foreground",
              valueClassName
            )}
          >
            {displayValue}
            {suffix && (
              <span className="ml-1 text-sm font-normal text-muted">
                {suffix}
              </span>
            )}
          </p>
          {subtext && (
            <p className="mt-1 line-clamp-2 text-xs text-muted">{subtext}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TeamMetrics({ teamPlan }: TeamMetricsProps) {
  const criticalRoles = countCriticalRoles(teamPlan);
  const skillGapCount = teamPlan.skillGaps.length;
  const teamRiskScore = computeTeamRiskScore(teamPlan);
  const founderReadiness = computeFounderReadiness(teamPlan);

  const riskColor =
    teamRiskScore >= 70
      ? "text-danger"
      : teamRiskScore >= 40
        ? "text-warning"
        : "text-success";

  const readinessColor =
    founderReadiness >= 70
      ? "text-success"
      : founderReadiness >= 45
        ? "text-warning"
        : "text-danger";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        label="Recommended Team Size"
        value={teamPlan.recommendedTeamSize}
        subtext="People for MVP delivery"
        icon={Users}
        index={0}
        animateValue
      />
      <MetricCard
        label="Critical Roles"
        value={criticalRoles}
        subtext="High-priority positions"
        icon={Target}
        index={1}
        animateValue
      />
      <MetricCard
        label="Skill Gap Count"
        value={skillGapCount}
        subtext="Skills missing from team"
        icon={Brain}
        index={2}
        animateValue
      />
      <MetricCard
        label="Team Risk Score"
        value={teamRiskScore}
        suffix="/ 100"
        subtext="Higher = more vulnerable"
        icon={AlertTriangle}
        index={3}
        animateValue
        valueClassName={riskColor}
      />
      <MetricCard
        label="Founder Readiness"
        value={founderReadiness}
        suffix="%"
        subtext="Current skill coverage"
        icon={UserCheck}
        index={4}
        animateValue
        valueClassName={readinessColor}
      />
    </div>
  );
}
