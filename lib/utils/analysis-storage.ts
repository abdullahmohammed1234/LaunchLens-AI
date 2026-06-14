import type { ProjectAnalysis } from "@/lib/validations/analysis";
import { projectAnalysisSchema } from "@/lib/validations/analysis";
import { ANALYSIS_STORAGE_KEY } from "@/lib/utils/analysis";

export interface StoredAnalysisResult {
  analysis: ProjectAnalysis;
  usedFallback: boolean;
  projectTitle?: string;
  timestamp: string;
}

export function saveAnalysisResult(result: StoredAnalysisResult): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(result));
}

export function loadAnalysisResult(): StoredAnalysisResult | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(ANALYSIS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredAnalysisResult;
    const validated = projectAnalysisSchema.safeParse(parsed.analysis);
    if (!validated.success) return null;
    return { ...parsed, analysis: validated.data };
  } catch {
    return null;
  }
}

export function clearAnalysisResult(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ANALYSIS_STORAGE_KEY);
}
