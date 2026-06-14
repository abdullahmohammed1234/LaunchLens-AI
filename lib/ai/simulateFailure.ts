import { GoogleGenerativeAI } from "@google/generative-ai";
import { createFallbackFailureSimulation } from "@/lib/ai/fallbackFailure";
import {
  GeminiQuotaError,
  GeminiUnavailableError,
  isQuotaError,
  isTransientError,
  isValidationError,
} from "@/lib/ai/errors";
import { buildFailureSimulationPrompt } from "@/lib/ai/prompts/failureSimulationPrompt";
import type { AnalyzeProjectInput } from "@/lib/validations/analysis";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import {
  failureSimulationSchema,
  type FailureSimulation,
} from "@/types/failure-simulation";

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

function normalizeSimulation(simulation: FailureSimulation): FailureSimulation {
  return {
    scenarios: simulation.scenarios.map((scenario) => ({
      ...scenario,
      timeline: [...scenario.timeline].sort((a, b) => a.month - b.month),
    })),
  };
}

export interface SimulateFailureInput {
  project: AnalyzeProjectInput;
  analysis: ProjectAnalysis;
}

export interface SimulateFailureResult {
  simulation: FailureSimulation;
  usedFallback: boolean;
  attempts: number;
  model?: string;
}

async function callGemini(
  input: SimulateFailureInput,
  attempt: number,
  modelName: string
): Promise<FailureSimulation> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: attempt === 0 ? 0.5 : 0.25,
    },
  });

  const prompt = buildFailureSimulationPrompt(
    { project: input.project, analysis: input.analysis },
    attempt
  );
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = parseJsonResponse(text);
  const validated = failureSimulationSchema.parse(parsed);
  return normalizeSimulation(validated);
}

export async function simulateFailure(
  input: SimulateFailureInput
): Promise<SimulateFailureResult> {
  const models = getModelChain();
  let totalAttempts = 0;
  let lastValidationError: unknown;
  let lastTransientError: unknown;

  for (const modelName of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      totalAttempts++;

      try {
        const simulation = await callGemini(input, attempt, modelName);
        return {
          simulation,
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
            `[simulateFailure] Model ${modelName} attempt ${attempt + 1} unavailable:`,
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
            `[simulateFailure] Model ${modelName} attempt ${attempt + 1} invalid output:`,
            error instanceof Error ? error.message : error
          );
          continue;
        }

        lastTransientError = error;
        console.error(
          `[simulateFailure] Model ${modelName} attempt ${attempt + 1} failed:`,
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
      "[simulateFailure] Validation retries exhausted, using fallback.",
      lastValidationError
    );
    return {
      simulation: createFallbackFailureSimulation(),
      usedFallback: true,
      attempts: totalAttempts,
    };
  }

  console.error(
    "[simulateFailure] All models and retries exhausted.",
    lastTransientError
  );

  throw new GeminiUnavailableError(
    "Gemini API is temporarily overloaded. We retried with backoff and alternate models — please wait a moment and try again."
  );
}
