"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { FileText, TrendingDown, TrendingUp } from "lucide-react";
import type { StoredExecutiveReport } from "@/types/executive-report";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface ReportHistoryItem {
  id: string;
  investmentReadinessScore: number;
  createdAt: string;
}

interface ReportHistoryProps {
  history: ReportHistoryItem[];
  activeReportId?: string;
  onSelectReport: (reportId: string) => void;
}

export function ReportHistory({
  history,
  activeReportId,
  onSelectReport,
}: ReportHistoryProps) {
  if (history.length <= 1) return null;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Report History</CardTitle>
        <p className="text-sm text-muted">
          Previous versions and score changes over time
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {history.map((item, i) => {
          const prev = history[i + 1];
          const scoreDelta = prev
            ? item.investmentReadinessScore - prev.investmentReadinessScore
            : 0;
          const isActive = item.id === activeReportId;

          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onSelectReport(item.id)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                isActive
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:border-primary/20 hover:bg-surface/50"
              )}
            >
              <FileText className="h-4 w-4 shrink-0 text-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Report v{history.length - i}
                </p>
                <p className="text-xs text-muted">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="tabular-nums">
                  {item.investmentReadinessScore}
                </Badge>
                {scoreDelta !== 0 && (
                  <span
                    className={cn(
                      "flex items-center text-xs font-medium",
                      scoreDelta > 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {scoreDelta > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                    )}
                    {scoreDelta > 0 ? "+" : ""}
                    {scoreDelta}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function buildHistoryFromReports(
  reports: StoredExecutiveReport[]
): ReportHistoryItem[] {
  return reports.map((r) => ({
    id: r.id,
    investmentReadinessScore: r.investmentReadinessScore,
    createdAt: r.createdAt,
  }));
}
