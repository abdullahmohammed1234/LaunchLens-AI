"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, RotateCcw } from "lucide-react";
import type { WhatIfImpact, WhatIfParameters } from "@/types/project-comparison";
import { getProjectTitle, scoreColor } from "@/lib/utils/project-comparison";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface WhatIfModeProps {
  onApply: (params: WhatIfParameters) => void;
  onReset: () => void;
  isLoading?: boolean;
  whatIfImpact?: WhatIfImpact[];
  projectTitles: Record<string, string>;
  hasActiveWhatIf: boolean;
}

export function WhatIfMode({
  onApply,
  onReset,
  isLoading = false,
  whatIfImpact,
  projectTitles,
  hasActiveWhatIf,
}: WhatIfModeProps) {
  const [budgetIncrease, setBudgetIncrease] = useState("");
  const [timelineExtension, setTimelineExtension] = useState("");
  const [additionalMembers, setAdditionalMembers] = useState("");

  function handleApply() {
    const params: WhatIfParameters = {};

    const budget = parseFloat(budgetIncrease);
    if (!isNaN(budget) && budget > 0) {
      params.budgetIncreasePercent = budget;
    }

    const timeline = parseFloat(timelineExtension);
    if (!isNaN(timeline) && timeline > 0) {
      params.timelineExtensionMonths = timeline;
    }

    const members = parseInt(additionalMembers, 10);
    if (!isNaN(members) && members > 0) {
      params.additionalTeamMembers = members;
    }

    if (
      !params.budgetIncreasePercent &&
      !params.timelineExtensionMonths &&
      !params.additionalTeamMembers
    ) {
      return;
    }

    onApply(params);
  }

  function handleReset() {
    setBudgetIncrease("");
    setTimelineExtension("");
    setAdditionalMembers("");
    onReset();
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FlaskConical className="h-5 w-5 text-primary" />
          What-If Mode
        </CardTitle>
        <p className="text-xs text-muted">
          Simulate resource changes and see how rankings shift
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Budget Increase (%)
            </label>
            <Input
              type="number"
              min={0}
              max={200}
              placeholder="e.g. 50"
              value={budgetIncrease}
              onChange={(e) => setBudgetIncrease(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Timeline Extension (months)
            </label>
            <Input
              type="number"
              min={0}
              max={24}
              placeholder="e.g. 3"
              value={timelineExtension}
              onChange={(e) => setTimelineExtension(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Additional Team Members
            </label>
            <Input
              type="number"
              min={0}
              max={20}
              placeholder="e.g. 2"
              value={additionalMembers}
              onChange={(e) => setAdditionalMembers(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApply} disabled={isLoading} size="sm">
            Rerun Comparison
          </Button>
          {hasActiveWhatIf && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        <AnimatePresence>
          {whatIfImpact && whatIfImpact.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 border-t border-border pt-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Impact on Rankings
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {whatIfImpact.map((impact) => (
                  <div
                    key={impact.projectId}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/30 px-4 py-3"
                  >
                    <span className="truncate text-sm text-foreground">
                      {getProjectTitle(impact.projectId, projectTitles)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">
                        {impact.previousScore} →
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          scoreColor(impact.newScore)
                        )}
                      >
                        {impact.newScore}
                      </span>
                      {impact.rankChange !== 0 && (
                        <Badge
                          variant={
                            impact.rankChange > 0 ? "success" : "danger"
                          }
                        >
                          {impact.rankChange > 0 ? "+" : ""}
                          {impact.rankChange}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
