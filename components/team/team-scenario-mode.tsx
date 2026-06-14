"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import type { TeamScenario } from "@/types/team-plan";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamScenarioModeProps {
  scenarios: TeamScenario[];
}

function ImpactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/50 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted" />
        <span className="text-sm text-muted">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: TeamScenario }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {scenario.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {scenario.summary}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <ImpactRow
              icon={TrendingUp}
              label="Success Impact"
              value={scenario.successImpact}
            />
            <ImpactRow
              icon={DollarSign}
              label="Cost Impact"
              value={scenario.costImpact}
            />
            <ImpactRow
              icon={Clock}
              label="Timeline Impact"
              value={scenario.timelineImpact}
            />
            <ImpactRow
              icon={AlertTriangle}
              label="Risk Impact"
              value={scenario.riskImpact}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TeamScenarioMode({ scenarios }: TeamScenarioModeProps) {
  const defaultTab = scenarios[1]?.name ?? scenarios[0]?.name ?? "Solo Founder";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Team Scenario Comparison
        </h2>
        <p className="mt-1 text-sm text-muted">
          Compare staffing approaches and their impact on success, cost, timeline,
          and risk.
        </p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid w-full grid-cols-3">
          {scenarios.map((scenario) => (
            <TabsTrigger
              key={scenario.name}
              value={scenario.name}
              className="text-xs sm:text-sm"
            >
              {scenario.name.replace(" Team", "")}
            </TabsTrigger>
          ))}
        </TabsList>

        {scenarios.map((scenario) => (
          <TabsContent key={scenario.name} value={scenario.name} className="mt-4">
            <AnimatePresence mode="wait">
              <ScenarioCard scenario={scenario} />
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-3">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={cn(
              "rounded-xl border border-border bg-card/50 p-4",
              scenario.name === "Small Team" && "border-primary/30 bg-primary/5"
            )}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {scenario.name}
            </p>
            <div className="space-y-1.5 text-xs">
              <p>
                <span className="text-muted">Success: </span>
                <span className="text-foreground">{scenario.successImpact}</span>
              </p>
              <p>
                <span className="text-muted">Cost: </span>
                <span className="text-foreground">{scenario.costImpact}</span>
              </p>
              <p>
                <span className="text-muted">Timeline: </span>
                <span className="text-foreground">{scenario.timelineImpact}</span>
              </p>
              <p>
                <span className="text-muted">Risk: </span>
                <span className="text-foreground">{scenario.riskImpact}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
