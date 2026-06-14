"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { CriticalSuccessFactor } from "@/types/roadmap";
import { Card, CardContent } from "@/components/ui/card";

interface CriticalSuccessFactorsProps {
  factors: CriticalSuccessFactor[];
}

export function CriticalSuccessFactors({
  factors,
}: CriticalSuccessFactorsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Critical Success Factors
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {factors.map((factor, index) => (
          <motion.div
            key={factor.title}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="h-full border-border bg-card transition-all hover:border-primary/20">
              <CardContent className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                  <Lightbulb className="h-4 w-4 text-warning" />
                </div>
                <p className="font-medium text-foreground">{factor.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {factor.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
