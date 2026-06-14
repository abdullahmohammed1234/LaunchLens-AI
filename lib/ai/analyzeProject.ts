import { GoogleGenerativeAI } from "@google/generative-ai";
import { createFallbackAnalysis } from "@/lib/ai/fallback";
import {
  GeminiQuotaError,
  GeminiUnavailableError,
  isQuotaError,
  isTransientError,
  isValidationError,
} from "@/lib/ai/errors";
import { buildProjectAnalysisPrompt } from "@/lib/ai/prompts/projectAnalysisPrompt";
import {
  projectAnalysisSchema,
  type AnalyzeProjectInput,
  type ProjectAnalysis,
} from "@/lib/validations/analysis";

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

function normalizeTimeline(analysis: ProjectAnalysis): ProjectAnalysis {
  const { minMonths, maxMonths } = analysis.estimatedTimeline;
  if (minMonths > maxMonths) {
    return {
      ...analysis,
      estimatedTimeline: { minMonths: maxMonths, maxMonths: minMonths },
    };
  }
  return analysis;
}

async function callGemini(
  input: AnalyzeProjectInput,
  attempt: number,
  modelName: string
): Promise<ProjectAnalysis> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: attempt === 0 ? 0.4 : 0.2,
    },
  });

  const prompt = buildProjectAnalysisPrompt(input, attempt);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = parseJsonResponse(text);
  const validated = projectAnalysisSchema.parse(parsed);
  return normalizeTimeline(validated);
}

export interface AnalyzeProjectResult {
  analysis: ProjectAnalysis;
  usedFallback: boolean;
  attempts: number;
  model?: string;
}

export async function analyzeProject(
  input: AnalyzeProjectInput
): Promise<AnalyzeProjectResult> {
  const models = getModelChain();
  let totalAttempts = 0;
  let lastValidationError: unknown;
  let lastTransientError: unknown;

  for (const modelName of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      totalAttempts++;

      try {
        const analysis = await callGemini(input, attempt, modelName);
        return {
          analysis,
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
            `[analyzeProject] Model ${modelName} attempt ${attempt + 1} unavailable:`,
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
            `[analyzeProject] Model ${modelName} attempt ${attempt + 1} invalid output:`,
            error instanceof Error ? error.message : error
          );
          continue;
        }

        lastTransientError = error;
        console.error(
          `[analyzeProject] Model ${modelName} attempt ${attempt + 1} failed:`,
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
      "[analyzeProject] Validation retries exhausted, using fallback.",
      lastValidationError
    );
    return {
      analysis: createFallbackAnalysis(),
      usedFallback: true,
      attempts: totalAttempts,
    };
  }

  console.error(
    "[analyzeProject] All models and retries exhausted.",
    lastTransientError
  );

  throw new GeminiUnavailableError(
    "Gemini API is temporarily overloaded. We retried with backoff and alternate models — please wait a moment and try again."
  );
}
