"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { StoredExecutiveReport } from "@/types/executive-report";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StrengthsWeaknessesProps {
  report: StoredExecutiveReport;
}

export function StrengthsWeaknesses({ report }: StrengthsWeaknessesProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-border bg-card h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <CardTitle className="text-base font-semibold">Strengths</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.strengths.map((strength, i) => (
              <div key={i} className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                >
                  {i + 1}
                </Badge>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {strength}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-border bg-card h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <CardTitle className="text-base font-semibold">Weaknesses</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.weaknesses.map((weakness, i) => (
              <div key={i} className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="shrink-0 border-red-500/30 bg-red-500/10 text-red-400"
                >
                  {i + 1}
                </Badge>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {weakness}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
