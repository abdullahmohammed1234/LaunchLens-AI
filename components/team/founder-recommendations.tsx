"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { FounderRecommendation } from "@/types/team-plan";
import { Card, CardContent } from "@/components/ui/card";

interface FounderRecommendationsProps {
  recommendations: FounderRecommendation[];
}

export function FounderRecommendations({
  recommendations,
}: FounderRecommendationsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Founder Recommendations
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -2 }}
          >
            <Card className="h-full border-border bg-card transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
              <CardContent className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {rec.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {rec.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
