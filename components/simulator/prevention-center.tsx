"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PreventionCenterProps {
  strategies: string[];
}

export function PreventionCenter({ strategies }: PreventionCenterProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Prevention Center</CardTitle>
        </div>
        <p className="text-sm text-muted">
          Recommended actions to avoid this failure path
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ x: 2 }}
            className="group flex items-start gap-3 rounded-lg border border-border/60 bg-surface/30 p-3 transition-all hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-card transition-colors group-hover:border-primary/40">
              <CheckCircle2 className="h-3 w-3 text-muted transition-colors group-hover:text-primary" />
            </div>
            <p className="text-sm leading-relaxed text-foreground">{strategy}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
