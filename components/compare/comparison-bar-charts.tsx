"use client";

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
import type { BarChartEntry } from "@/types/project-comparison";
import { CHART_COLORS, getProjectTitle } from "@/lib/utils/project-comparison";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonBarChartsProps {
  barChartData: BarChartEntry[];
  projectTitles: Record<string, string>;
}

function ChartCard({
  title,
  description,
  children,
  delay,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
          <p className="text-xs text-muted">{description}</p>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

export function ComparisonBarCharts({
  barChartData,
  projectTitles,
}: ComparisonBarChartsProps) {
  const chartData = barChartData.map((entry, index) => ({
    name: (() => {
      const title = getProjectTitle(entry.projectId, projectTitles);
      return title.length > 14 ? `${title.slice(0, 12)}…` : title;
    })(),
    fullName: getProjectTitle(entry.projectId, projectTitles),
    timelineMonths: entry.timelineMonths,
    teamSize: entry.teamSize,
    successScore: entry.successScore,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const tooltipStyle = {
    backgroundColor: "#18181B",
    border: "1px solid #27272A",
    borderRadius: "8px",
    fontSize: "12px",
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="Timeline Comparison"
        description="Estimated months to launch"
        delay={0.1}
      >
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 11 }} />
              <YAxis tick={{ fill: "#A1A1AA", fontSize: 11 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} months`, "Timeline"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar dataKey="timelineMonths" radius={[4, 4, 0, 0]} animationDuration={800}>
                {chartData.map((entry, index) => (
                  <Cell key={`timeline-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="Team Size Comparison"
        description="Recommended team members"
        delay={0.15}
      >
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 11 }} />
              <YAxis tick={{ fill: "#A1A1AA", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} people`, "Team Size"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar dataKey="teamSize" radius={[4, 4, 0, 0]} animationDuration={800}>
                {chartData.map((entry, index) => (
                  <Cell key={`team-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="Success Score Comparison"
        description="AI-assessed success probability"
        delay={0.2}
      >
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#A1A1AA", fontSize: 11 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value}%`, "Success Score"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar dataKey="successScore" radius={[4, 4, 0, 0]} animationDuration={800}>
                {chartData.map((entry, index) => (
                  <Cell key={`success-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
