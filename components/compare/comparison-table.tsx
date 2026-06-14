"use client";

import { motion } from "framer-motion";
import type { HeadToHeadMetric } from "@/types/project-comparison";
import {
  getProjectTitle,
  levelToBadgeVariant,
  scoreBgColor,
} from "@/lib/utils/project-comparison";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare } from "lucide-react";

interface ComparisonTableProps {
  headToHead: HeadToHeadMetric[];
  projectTitles: Record<string, string>;
  selectedProjectIds: string[];
}

export function ComparisonTable({
  headToHead,
  projectTitles,
  selectedProjectIds,
}: ComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="border-b border-border bg-surface/30">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="h-5 w-5 text-primary" />
            Head-to-Head Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 bg-card px-6 py-4 text-left font-medium text-muted">
                    Metric
                  </th>
                  {selectedProjectIds.map((id) => (
                    <th
                      key={id}
                      className="min-w-[140px] px-4 py-4 text-center font-medium text-foreground"
                    >
                      <span className="line-clamp-2">
                        {getProjectTitle(id, projectTitles)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {headToHead.map((row, rowIndex) => (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + rowIndex * 0.04 }}
                    className={cn(
                      "border-b border-border/60 transition-colors hover:bg-surface/30",
                      rowIndex % 2 === 0 ? "bg-card" : "bg-surface/20"
                    )}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-6 py-4 font-medium text-foreground">
                      {row.name}
                    </td>
                    {selectedProjectIds.map((projectId) => {
                      const value = row.values.find(
                        (v) => v.projectId === projectId
                      );
                      if (!value) {
                        return (
                          <td
                            key={projectId}
                            className="px-4 py-4 text-center text-muted"
                          >
                            —
                          </td>
                        );
                      }

                      return (
                        <td key={projectId} className="px-4 py-4">
                          <div className="flex flex-col items-center gap-2">
                            {value.level ? (
                              <Badge variant={levelToBadgeVariant(value.level)}>
                                {value.label}
                              </Badge>
                            ) : (
                              <span className="font-semibold text-foreground">
                                {value.label}
                              </span>
                            )}
                            <div className="h-1.5 w-full max-w-[100px] overflow-hidden rounded-full bg-border/60">
                              <motion.div
                                className={cn(
                                  "h-full rounded-full",
                                  scoreBgColor(value.score)
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${value.score}%` }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.4 + rowIndex * 0.04,
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-muted">
                              {value.score}/100
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
