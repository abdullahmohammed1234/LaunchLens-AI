"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RadarDimension } from "@/types/project-comparison";
import {
  CHART_COLORS,
  getProjectTitle,
  RADAR_AXES,
} from "@/lib/utils/project-comparison";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonRadarChartProps {
  radarData: RadarDimension[];
  projectTitles: Record<string, string>;
}

export function ComparisonRadarChart({
  radarData,
  projectTitles,
}: ComparisonRadarChartProps) {
  const chartData = RADAR_AXES.map((axis) => {
    const point: Record<string, string | number> = { axis: axis.label };
    radarData.forEach((entry) => {
      const title = getProjectTitle(entry.projectId, projectTitles);
      const shortTitle =
        title.length > 12 ? `${title.slice(0, 10)}…` : title;
      point[shortTitle] = entry[axis.key];
    });
    return point;
  });

  const series = radarData.map((entry, index) => ({
    key: getProjectTitle(entry.projectId, projectTitles),
    shortKey: (() => {
      const title = getProjectTitle(entry.projectId, projectTitles);
      return title.length > 12 ? `${title.slice(0, 10)}…` : title;
    })(),
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Multi-Dimensional Comparison</CardTitle>
          <p className="text-xs text-muted">
            Higher values indicate better positioning (lower risk, simpler, more ready)
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#27272A" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#A1A1AA", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181B",
                    border: "1px solid #27272A",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                {series.map((s, index) => (
                  <Radar
                    key={s.key}
                    name={s.key}
                    dataKey={s.shortKey}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    animationDuration={800}
                    animationBegin={index * 150}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {series.map((s) => (
              <div key={s.key} className="flex items-center gap-2 text-xs">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-muted">{s.key}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
