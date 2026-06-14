"use client";

import { motion } from "framer-motion";
import {
  AlertOctagon,
  Target,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";
import type { FailureSimulation } from "@/types/failure-simulation";
import {
  computeFailureRiskScore,
  failureRiskLabel,
  getHighestSeverityScenario,
  getMostLikelyScenario,
  getRecommendedPriority,
  probabilityColor,
  severityAccentClass,
} from "@/lib/utils/failure-simulation";
import { useAnimatedNumber } from "@/lib/hooks/use-animated-number";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";

interface SimulationMetricsProps {
  simulation: FailureSimulation;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  valueClassName?: string;
  index: number;
  animateValue?: boolean;
}

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  valueClassName,
  index,
  animateValue = false,
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
            {animateValue && (
              <span className="ml-1 text-sm font-normal text-muted">/ 100</span>
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

export function SimulationMetrics({ simulation }: SimulationMetricsProps) {
  const riskScore = computeFailureRiskScore(simulation);
  const mostLikely = getMostLikelyScenario(simulation);
  const highestSeverity = getHighestSeverityScenario(simulation);
  const priority = getRecommendedPriority(simulation);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Failure Risk Score"
        value={riskScore}
        subtext={failureRiskLabel(riskScore)}
        icon={TrendingDown}
        valueClassName={probabilityColor(riskScore)}
        index={0}
        animateValue
      />
      <MetricCard
        label="Most Likely Failure"
        value={mostLikely.title}
        subtext={`${mostLikely.probability}% probability`}
        icon={Target}
        valueClassName="text-base leading-snug"
        index={1}
      />
      <MetricCard
        label="Highest Severity"
        value={highestSeverity.title}
        subtext={`${highestSeverity.severity} impact`}
        icon={AlertOctagon}
        valueClassName={cn(
          "text-base leading-snug capitalize",
          severityAccentClass(highestSeverity.severity)
        )}
        index={2}
      />
      <MetricCard
        label="Recommended Priority"
        value={priority}
        icon={ShieldCheck}
        valueClassName="text-sm font-semibold leading-snug"
        index={3}
      />
    </div>
  );
}
