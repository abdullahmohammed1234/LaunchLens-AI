"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PortfolioAnalytics } from "@/types/portfolio";
import { PORTFOLIO_CHART_COLORS } from "@/lib/portfolio/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tooltipStyle = {
  backgroundColor: "#18181B",
  border: "1px solid #27272A",
  borderRadius: "8px",
  fontSize: "12px",
};

const RISK_COLORS: Record<string, string> = {
  low: "#10B981",
  medium: "#F59E0B",
  high: "#EF4444",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "#71717A",
  active: "#6366F1",
  archived: "#F59E0B",
};

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

interface PortfolioChartsProps {
  analytics: PortfolioAnalytics;
}

export function PortfolioCharts({ analytics }: PortfolioChartsProps) {
  const successData = analytics.successDistribution.map((d, i) => ({
    ...d,
    fill: PORTFOLIO_CHART_COLORS[i % PORTFOLIO_CHART_COLORS.length],
  }));

  const riskData = analytics.riskDistribution.map((d) => ({
    name: d.level,
    value: d.count,
    fill: RISK_COLORS[d.level],
  }));

  const statusData = analytics.statusBreakdown.map((d) => ({
    name: d.status,
    value: d.count,
    fill: STATUS_COLORS[d.status],
  }));

  const trendData = analytics.readinessTrends.map((d) => ({
    date: d.date.slice(5),
    readiness: d.averageReadiness,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Success Score Distribution"
        description="How projects score across feasibility ranges"
        delay={0.1}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={successData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#71717A" }} />
            <YAxis tick={{ fontSize: 11, fill: "#71717A" }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {successData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Risk Distribution"
        description="Portfolio risk level breakdown"
        delay={0.15}
      >
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={riskData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {riskData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-center gap-4">
          {riskData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: d.fill }}
              />
              {d.name} ({d.value})
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard
        title="Readiness Trends"
        description="Average readiness over time"
        delay={0.2}
      >
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717A" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#71717A" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="readiness"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ fill: "#6366F1", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[220px] items-center justify-center text-sm text-muted">
            Generate executive reports to see readiness trends
          </div>
        )}
      </ChartCard>

      <ChartCard
        title="Project Status Breakdown"
        description="Draft, active, and archived projects"
        delay={0.25}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={statusData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#71717A" }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#71717A" }}
              width={70}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {statusData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
