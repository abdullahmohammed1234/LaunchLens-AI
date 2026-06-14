"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { ComparisonCategory } from "@/types/project-comparison";
import { getProjectTitle } from "@/lib/utils/project-comparison";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryBreakdownProps {
  categories: ComparisonCategory[];
  projectTitles: Record<string, string>;
}

export function CategoryBreakdown({
  categories,
  projectTitles,
}: CategoryBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Category Winners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.04 }}
                className="rounded-lg border border-border bg-surface/30 p-4"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  <p className="text-xs font-medium text-muted">
                    {category.name}
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {getProjectTitle(category.winner, projectTitles)}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {category.reason}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
