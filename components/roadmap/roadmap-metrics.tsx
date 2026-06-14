"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CheckSquare,
  Flag,
  Layers,
  Target,
} from "lucide-react";
import type { Roadmap } from "@/types/roadmap";
import {
  countMilestones,
  countTasks,
} from "@/lib/utils/roadmap";
import { useAnimatedNumber } from "@/lib/hooks/use-animated-number";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";

interface RoadmapMetricsProps {
  roadmap: Roadmap;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  index: number;
  animateValue?: boolean;
}

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
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
          <p className={cn("text-xl font-bold tracking-tight text-foreground")}>
            {displayValue}
            {animateValue && label === "Estimated Duration" && (
              <span className="ml-1 text-sm font-normal text-muted">months</span>
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

export function RoadmapMetrics({ roadmap }: RoadmapMetricsProps) {
  const milestones = countMilestones(roadmap);
  const tasks = countTasks(roadmap);
  const phases = roadmap.phases.length;
  const successFactors = roadmap.criticalSuccessFactors.length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        label="Estimated Duration"
        value={roadmap.estimatedDurationMonths}
        subtext={`${phases} delivery phases`}
        icon={Calendar}
        index={0}
        animateValue
      />
      <MetricCard
        label="Phases"
        value={phases}
        subtext="Execution stages"
        icon={Layers}
        index={1}
        animateValue
      />
      <MetricCard
        label="Milestones"
        value={milestones}
        subtext="Progress checkpoints"
        icon={Flag}
        index={2}
        animateValue
      />
      <MetricCard
        label="Tasks"
        value={tasks}
        subtext="Actionable work items"
        icon={CheckSquare}
        index={3}
        animateValue
      />
      <MetricCard
        label="Critical Success Factors"
        value={successFactors}
        subtext="Key execution principles"
        icon={Target}
        index={4}
        animateValue
      />
    </div>
  );
}
