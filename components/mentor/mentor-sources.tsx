"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  FileText,
  FlaskConical,
  Map,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  MENTOR_SOURCE_LABELS,
  type MentorSource,
} from "@/types/mentor";

const SOURCE_ICONS: Record<MentorSource, typeof BarChart3> = {
  analysis_engine: BarChart3,
  failure_simulator: FlaskConical,
  roadmap_generator: Map,
  team_builder: Users,
  executive_reports: FileText,
  portfolio_analytics: Briefcase,
};

interface MentorSourcesProps {
  sources: MentorSource[];
  confidence?: number;
}

export function MentorSources({ sources, confidence }: MentorSourcesProps) {
  if (sources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-xs font-medium text-muted">Sources:</span>
      {sources.map((source, index) => {
        const Icon = SOURCE_ICONS[source];
        return (
          <motion.div
            key={source}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Badge variant="secondary" className="gap-1.5">
              <Icon className="h-3 w-3" />
              {MENTOR_SOURCE_LABELS[source]}
            </Badge>
          </motion.div>
        );
      })}
      {confidence !== undefined && (
        <Badge variant="outline" className="ml-auto">
          {confidence}% confidence
        </Badge>
      )}
    </motion.div>
  );
}
