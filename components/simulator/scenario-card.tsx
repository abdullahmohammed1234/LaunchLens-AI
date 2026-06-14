"use client";

import { motion } from "framer-motion";
import type { FailureScenario } from "@/types/failure-simulation";
import {
  probabilityColor,
  severityAccentClass,
  severityBorderClass,
  severityToBadgeVariant,
} from "@/lib/utils/failure-simulation";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ScenarioCardProps {
  scenario: FailureScenario;
  index?: number;
  selected?: boolean;
  onClick?: () => void;
}

export function ScenarioCard({
  scenario,
  index = 0,
  selected = false,
  onClick,
}: ScenarioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
    >
      <Card
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") onClick();
              }
            : undefined
        }
        className={cn(
          "cursor-pointer border bg-card transition-all duration-200",
          severityBorderClass(scenario.severity),
          selected && "border-primary ring-1 ring-primary/30",
          onClick && "hover:shadow-lg hover:shadow-primary/5"
        )}
      >
        <CardContent className="p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-snug text-foreground">
              {scenario.title}
            </h3>
            <Badge variant={severityToBadgeVariant(scenario.severity)}>
              {scenario.severity}
            </Badge>
          </div>

          <div className="mb-3 flex items-baseline gap-1">
            <span
              className={cn(
                "text-2xl font-bold tracking-tight",
                probabilityColor(scenario.probability)
              )}
            >
              {scenario.probability}%
            </span>
            <span className="text-xs text-muted">probability</span>
          </div>

          <p className="line-clamp-3 text-xs leading-relaxed text-muted">
            {scenario.summary}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-muted">Impact</span>
            <span
              className={cn(
                "font-medium capitalize",
                severityAccentClass(scenario.severity)
              )}
            >
              {scenario.severity}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
