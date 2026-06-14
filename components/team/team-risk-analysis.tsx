"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import type { TeamRisk } from "@/types/team-plan";
import {
  severityAccentClass,
  severityBorderClass,
  severityToBadgeVariant,
} from "@/lib/utils/team-plan";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface TeamRiskAnalysisProps {
  risks: TeamRisk[];
}

export function TeamRiskAnalysis({ risks }: TeamRiskAnalysisProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Team Risk Analysis
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {risks.map((risk, index) => (
          <motion.div
            key={risk.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -2 }}
          >
            <Card
              className={cn(
                "h-full border bg-card transition-all duration-200 hover:shadow-lg hover:shadow-primary/5",
                severityBorderClass(risk.severity)
              )}
            >
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger/10">
                      <ShieldAlert className="h-4 w-4 text-danger" />
                    </div>
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {risk.title}
                    </h3>
                  </div>
                  <Badge variant={severityToBadgeVariant(risk.severity)}>
                    {risk.severity}
                  </Badge>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted">
                  {risk.description}
                </p>

                <div className="rounded-lg border border-border/60 bg-surface/50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    Mitigation
                  </p>
                  <p className="text-xs leading-relaxed text-foreground">
                    {risk.mitigation}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-muted">Impact</span>
                  <span
                    className={cn(
                      "font-medium capitalize",
                      severityAccentClass(risk.severity)
                    )}
                  >
                    {risk.severity}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
