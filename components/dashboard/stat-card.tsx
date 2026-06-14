"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  index?: number;
  className?: string;
}

const trendConfig = {
  up: { icon: TrendingUp, color: "text-success" },
  down: { icon: TrendingDown, color: "text-danger" },
  neutral: { icon: Minus, color: "text-muted" },
};

export function StatCard({
  label,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  index = 0,
  className,
}: StatCardProps) {
  const TrendIcon = trendConfig[trend].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={cn(
          "group border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted">{label}</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {value}
              </p>
              {change && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    trendConfig[trend].color
                  )}
                >
                  <TrendIcon className="h-3 w-3" />
                  <span>{change}</span>
                </div>
              )}
            </div>
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
