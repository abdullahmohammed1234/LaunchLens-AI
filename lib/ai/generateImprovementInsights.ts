import { GoogleGenerativeAI } from "@google/generative-ai";
import { createFallbackImprovementInsights } from "@/lib/ai/fallbackImprovementInsights";
import {
  GeminiQuotaError,
  isQuotaError,
  isTransientError,
  isValidationError,
} from "@/lib/ai/errors";
import {
  buildImprovementInsightsPrompt,
  type ImprovementInsightsPromptInput,
} from "@/lib/ai/prompts/improvementInsightsPrompt";
import {
  improvementInsightsSchema,
  type ImprovementInsights,
  type ProjectEvolution,
} from "@/types/portfolio";

const MAX_RETRIES = 2;
const DEFAULT_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = ["gemini-2.5-flash-lite"];
const RETRY_DELAYS_MS = [2000, 4000];

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

function buildHistoricalSummary(evolution: ProjectEvolution): string {
  const parts: string[] = [];
  parts.push(`Total events: ${evolution.events.length}`);
  const analysisCount = evolution.events.filter((e) => e.type === "analysis").length;
  parts.push(`Analyses run: ${analysisCount}`);
  if (evolution.currentAnalysis) {
    parts.push(
      `Latest success: ${evolution.currentAnalysis.successScore}, risk: ${evolution.currentAnalysis.riskLevel}`
    );
  }
  return parts.join(". ");
}

async function callGemini(
  input: ImprovementInsightsPromptInput,
  attempt: number,
  modelName: string
): Promise<ImprovementInsights> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: attempt === 0 ? 0.35 : 0.15,
    },
  });

  const prompt = buildImprovementInsightsPrompt(input, attempt);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = parseJsonResponse(text);
  return improvementInsightsSchema.parse(parsed);
}

export async function generateImprovementInsights(
  evolution: ProjectEvolution
): Promise<{
  insights: ImprovementInsights;
  usedFallback: boolean;
  attempts: number;
}> {
  const input: ImprovementInsightsPromptInput = {
    projectTitle: evolution.projectTitle,
    evolution,
    historicalSummary: buildHistoricalSummary(evolution),
  };

  const models = getModelChain();
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    for (const modelName of models) {
      try {
        const insights = await callGemini(input, attempt, modelName);
        return { insights, usedFallback: false, attempts: attempt + 1 };
      } catch (error) {
        lastError = error;
        if (isQuotaError(error)) {
          throw new GeminiQuotaError(
            "AI quota exceeded. Please try again later."
          );
        }
        if (isValidationError(error) || isTransientError(error)) {
          if (attempt < MAX_RETRIES) {
            await sleep(RETRY_DELAYS_MS[attempt] ?? 4000);
          }
          continue;
        }
      }
    }
  }

  if (lastError && !isQuotaError(lastError)) {
    console.warn(
      "[generateImprovementInsights] Using fallback:",
      lastError instanceof Error ? lastError.message : lastError
    );
  }

  return {
    insights: createFallbackImprovementInsights(evolution),
    usedFallback: true,
    attempts: MAX_RETRIES + 1,
  };
}
