"use client";

import { motion } from "framer-motion";
import type { StoredExecutiveReport } from "@/types/executive-report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExecutiveSummarySectionProps {
  report: StoredExecutiveReport;
}

export function ExecutiveSummarySection({ report }: ExecutiveSummarySectionProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-foreground/90">
              {report.executiveSummary}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">
              Overall Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-foreground/90">
              {report.overallAssessment}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-border border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">
              Final Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-foreground">
              {report.finalRecommendation}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
