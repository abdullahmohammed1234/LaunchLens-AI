"use client";

import { motion } from "framer-motion";
import type { CriticalRisk } from "@/types/executive-report";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface RiskBriefingProps {
  risks: CriticalRisk[];
}

function levelColor(level: string) {
  switch (level) {
    case "high":
      return "border-red-500/30 bg-red-500/10 text-red-400";
    case "medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    default:
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
  }
}

function sourceLabel(source?: string) {
  switch (source) {
    case "analysis":
      return "Analysis";
    case "simulation":
      return "Simulation";
    case "roadmap":
      return "Roadmap";
    case "team":
      return "Team";
    default:
      return "General";
  }
}

export function RiskBriefing({ risks }: RiskBriefingProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Risk Briefing</CardTitle>
        <p className="text-sm text-muted">
          Unified risks from analysis, simulation, roadmap, and team intelligence
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {risks.map((risk, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-lg border border-border bg-surface/50 p-4"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-foreground">{risk.title}</h4>
              <Badge variant="outline" className={cn("text-xs", levelColor(risk.severity))}>
                {risk.severity} severity
              </Badge>
              <Badge variant="outline" className="text-xs">
                {sourceLabel(risk.source)}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Impact
                </p>
                <p className="mt-1 text-sm text-foreground/90">{risk.impact}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Likelihood
                </p>
                <Badge
                  variant="outline"
                  className={cn("mt-1 text-xs", levelColor(risk.likelihood))}
                >
                  {risk.likelihood}
                </Badge>
              </div>
            </div>

            <div className="mt-3 border-t border-border/60 pt-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Mitigation
              </p>
              <p className="mt-1 text-sm text-foreground/90">{risk.mitigation}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
