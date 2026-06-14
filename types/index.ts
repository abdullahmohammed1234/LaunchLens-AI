export interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "analyzing" | "completed";
  successScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisResult {
  successProbability: number;
  riskLevel: "low" | "medium" | "high";
  estimatedTimeline: string;
  missingSkills: string[];
  insights: string[];
}

export interface StatMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}
