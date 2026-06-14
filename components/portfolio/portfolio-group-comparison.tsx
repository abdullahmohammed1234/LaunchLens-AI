"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  PortfolioGroupComparison,
  PortfolioProject,
} from "@/types/portfolio";
import { PORTFOLIO_CHART_COLORS } from "@/lib/portfolio/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PortfolioLoading } from "@/components/portfolio/portfolio-loading";

interface PortfolioGroupComparisonProps {
  projects: PortfolioProject[];
}

export function PortfolioGroupComparison({
  projects,
}: PortfolioGroupComparisonProps) {
  const [groupAName, setGroupAName] = useState("Group A");
  const [groupBName, setGroupBName] = useState("Group B");
  const [groupAIds, setGroupAIds] = useState<string[]>([]);
  const [groupBIds, setGroupBIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<PortfolioGroupComparison[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  function toggleProject(
    projectId: string,
    group: "a" | "b"
  ) {
    if (group === "a") {
      setGroupAIds((prev) =>
        prev.includes(projectId)
          ? prev.filter((id) => id !== projectId)
          : [...prev, projectId]
      );
    } else {
      setGroupBIds((prev) =>
        prev.includes(projectId)
          ? prev.filter((id) => id !== projectId)
          : [...prev, projectId]
      );
    }
  }

  async function handleCompare() {
    if (groupAIds.length === 0 || groupBIds.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio/compare-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groups: [
            { name: groupAName, projectIds: groupAIds },
            { name: groupBName, projectIds: groupBIds },
          ],
        }),
      });
      const data = await res.json();
      setComparison(data.comparison);
    } finally {
      setLoading(false);
    }
  }

  const chartData =
    comparison?.map((g, i) => ({
      name: g.groupName,
      success: g.averageSuccess,
      readiness: g.averageReadiness,
      risk: g.averageRisk,
      fill: PORTFOLIO_CHART_COLORS[i % PORTFOLIO_CHART_COLORS.length],
    })) ?? [];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Portfolio Group Comparison</CardTitle>
        <p className="text-sm text-muted">
          Compare project groups by average scores and opportunity ranking
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Input
              value={groupAName}
              onChange={(e) => setGroupAName(e.target.value)}
              placeholder="Group A name"
            />
            <Select
              onValueChange={(id) => toggleProject(id, "a")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Add projects to Group A" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {groupAIds.includes(p.id) ? "✓ " : ""}
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted">
              {groupAIds.length} project(s) selected
            </p>
          </div>
          <div className="space-y-3">
            <Input
              value={groupBName}
              onChange={(e) => setGroupBName(e.target.value)}
              placeholder="Group B name"
            />
            <Select onValueChange={(id) => toggleProject(id, "b")}>
              <SelectTrigger>
                <SelectValue placeholder="Add projects to Group B" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {groupBIds.includes(p.id) ? "✓ " : ""}
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted">
              {groupBIds.length} project(s) selected
            </p>
          </div>
        </div>

        <Button
          onClick={handleCompare}
          disabled={groupAIds.length === 0 || groupBIds.length === 0 || loading}
        >
          Compare Groups
        </Button>

        {loading && <PortfolioLoading message="Evaluating project trends..." />}

        {comparison && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {comparison.map((group) => (
                <div
                  key={group.groupName}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">
                      {group.groupName}
                    </h4>
                    <span className="text-xs text-primary">
                      Rank #{group.opportunityRank}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-muted">Success</p>
                      <p className="font-bold text-foreground">
                        {group.averageSuccess}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Risk</p>
                      <p className="font-bold text-foreground">
                        {group.averageRisk}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Ready</p>
                      <p className="font-bold text-foreground">
                        {group.averageReadiness}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717A" }} />
                <YAxis tick={{ fontSize: 11, fill: "#71717A" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181B",
                    border: "1px solid #27272A",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="success" name="Success" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar dataKey="readiness" name="Readiness" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
