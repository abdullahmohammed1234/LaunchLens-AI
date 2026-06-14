"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ScoreRingProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

const SIZE_MAP = {
  sm: { ring: 80, stroke: 6, text: "text-lg" },
  md: { ring: 100, stroke: 7, text: "text-2xl" },
  lg: { ring: 120, stroke: 8, text: "text-3xl" },
};

function getScoreColor(score: number) {
  if (score >= 70) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function getStrokeColor(score: number) {
  if (score >= 70) return "#34d399";
  if (score >= 50) return "#fbbf24";
  return "#f87171";
}

export function ScoreRing({
  score,
  label,
  size = "md",
  delay = 0,
}: ScoreRingProps) {
  const { ring, stroke, text } = SIZE_MAP[size];
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative" style={{ width: ring, height: ring }}>
        <svg width={ring} height={ring} className="-rotate-90">
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-border/40"
          />
          <motion.circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor(score)}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold tabular-nums", text, getScoreColor(score))}>
            {score}
          </span>
        </div>
      </div>
      <p className="text-center text-xs font-medium text-muted">{label}</p>
    </motion.div>
  );
}
