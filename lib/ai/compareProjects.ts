import { GoogleGenerativeAI } from "@google/generative-ai";
import { createFallbackComparison } from "@/lib/ai/fallbackCompareProjects";
import {
  GeminiQuotaError,
  GeminiUnavailableError,
  isQuotaError,
  isTransientError,
  isValidationError,
} from "@/lib/ai/errors";
import {
  buildCompareProjectsPrompt,
  type CompareProjectsPromptInput,
} from "@/lib/ai/prompts/compareProjectsPrompt";
import {
  projectComparisonSchema,
  type ProjectComparisonResult,
  type WhatIfParameters,
} from "@/types/project-comparison";

const MAX_RETRIES = 2;
const DEFAULT_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = ["gemini-2.5-flash-lite"];
const RETRY_DELAYS_MS = [2000, 4000, 6000];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getModelChain(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  return [...new Set([primary, ...FALLBACK_MODELS])];
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
}

function parseJsonResponse(text: string): unknown {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenceMatch ? fenceMatch[1].trim() : trimmed;
  return JSON.parse(jsonText);
}

function validateProjectIds(
  result: ProjectComparisonResult,
  projectIds: string[]
): ProjectComparisonResult {
  const idSet = new Set(projectIds);

  const assertId = (id: string, field: string) => {
    if (!idSet.has(id)) {
      throw new Error(`Invalid ${field}: ${id} not in project list`);
    }
  };

  assertId(result.winner, "winner");
  assertId(result.decision.recommendedProjectId, "decision.recommendedProjectId");
  assertId(result.highlights.bestOverall, "highlights.bestOverall");
  assertId(result.highlights.highestSuccess, "highlights.highestSuccess");
  assertId(result.highlights.lowestRisk, "highlights.lowestRisk");
  assertId(result.highlights.fastestLaunch, "highlights.fastestLaunch");
  assertId(result.highlights.lowestComplexity, "highlights.lowestComplexity");
  assertId(result.highlights.bestSkillFit, "highlights.bestSkillFit");

  for (const category of result.categories) {
    assertId(category.winner, `category.winner (${category.name})`);
  }

  if (result.projectScores.length !== projectIds.length) {
    throw new Error("projectScores length mismatch");
  }

  for (const score of result.projectScores) {
    assertId(score.projectId, "projectScores.projectId");
  }

  return result;
}

export interface CompareProjectsInput extends CompareProjectsPromptInput {
  whatIf?: WhatIfParameters;
}

export interface CompareProjectsResult {
  comparison: ProjectComparisonResult;
  usedFallback: boolean;
  attempts: number;
  model?: string;
}

async function callGemini(
  input: CompareProjectsInput,
  attempt: number,
  modelName: string
): Promise<ProjectComparisonResult> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: attempt === 0 ? 0.35 : 0.15,
    },
  });

  const prompt = buildCompareProjectsPrompt(input, attempt);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = parseJsonResponse(text);
  const comparison = projectComparisonSchema.parse(parsed);
  const projectIds = input.projects.map((p) => p.projectId);
  return validateProjectIds(comparison, projectIds);
}

export async function compareProjects(
  input: CompareProjectsInput
): Promise<CompareProjectsResult> {
  const models = getModelChain();
  let totalAttempts = 0;
  let lastValidationError: unknown;
  let lastTransientError: unknown;

  for (const modelName of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      totalAttempts++;

      try {
        const comparison = await callGemini(input, attempt, modelName);
        return {
          comparison,
          usedFallback: false,
          attempts: totalAttempts,
          model: modelName,
        };
      } catch (error) {
        if (isQuotaError(error)) {
          throw new GeminiQuotaError(
            `Gemini API quota exceeded for model "${modelName}". ` +
              "Check billing at https://aistudio.google.com/apikey"
          );
        }

        if (isTransientError(error)) {
          lastTransientError = error;
          console.error(
            `[compareProjects] Model ${modelName} attempt ${attempt + 1} unavailable:`,
            error instanceof Error ? error.message : error
          );

          if (attempt < MAX_RETRIES) {
            await sleep(RETRY_DELAYS_MS[attempt] ?? 6000);
            continue;
          }
          break;
        }

        if (isValidationError(error)) {
          lastValidationError = error;
          console.error(
            `[compareProjects] Model ${modelName} attempt ${attempt + 1} invalid output:`,
            error instanceof Error ? error.message : error
          );
          continue;
        }

        lastTransientError = error;
        console.error(
          `[compareProjects] Model ${modelName} attempt ${attempt + 1} failed:`,
          error instanceof Error ? error.message : error
        );

        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAYS_MS[attempt] ?? 4000);
        }
      }
    }
  }

  if (lastValidationError && !lastTransientError) {
    console.error(
      "[compareProjects] Validation retries exhausted, using fallback.",
      lastValidationError
    );
    return {
      comparison: createFallbackComparison(input.projects),
      usedFallback: true,
      attempts: totalAttempts,
    };
  }

  console.error(
    "[compareProjects] All models and retries exhausted.",
    lastTransientError
  );

  throw new GeminiUnavailableError(
    "Gemini API is temporarily overloaded. We retried with backoff and alternate models — please wait a moment and try again."
  );
}
