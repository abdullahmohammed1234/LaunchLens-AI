import { GoogleGenerativeAI } from "@google/generative-ai";
import { createFallbackExecutiveReport } from "@/lib/ai/fallbackExecutiveReport";
import {
  GeminiQuotaError,
  GeminiUnavailableError,
  isQuotaError,
  isTransientError,
  isValidationError,
} from "@/lib/ai/errors";
import {
  buildExecutiveReportPrompt,
  type ExecutiveReportPromptInput,
} from "@/lib/ai/prompts/executiveReportPrompt";
import {
  executiveReportSchema,
  type ExecutiveReportData,
} from "@/types/executive-report";

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

function normalizeSteps(report: ExecutiveReportData): ExecutiveReportData {
  const sorted = [...report.recommendedNextSteps].sort(
    (a, b) => a.order - b.order
  );
  return { ...report, recommendedNextSteps: sorted };
}

async function callGemini(
  input: ExecutiveReportPromptInput,
  attempt: number,
  modelName: string
): Promise<ExecutiveReportData> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: attempt === 0 ? 0.35 : 0.15,
    },
  });

  const prompt = buildExecutiveReportPrompt(input, attempt);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = parseJsonResponse(text);
  const validated = executiveReportSchema.parse(parsed);
  return normalizeSteps(validated);
}

export interface GenerateExecutiveReportResult {
  report: ExecutiveReportData;
  usedFallback: boolean;
  attempts: number;
  model?: string;
}

export async function generateExecutiveReport(
  input: ExecutiveReportPromptInput
): Promise<GenerateExecutiveReportResult> {
  const models = getModelChain();
  let totalAttempts = 0;
  let lastValidationError: unknown;
  let lastTransientError: unknown;

  for (const modelName of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      totalAttempts++;

      try {
        const report = await callGemini(input, attempt, modelName);
        return {
          report,
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
            `[generateExecutiveReport] Model ${modelName} attempt ${attempt + 1} unavailable:`,
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
            `[generateExecutiveReport] Model ${modelName} attempt ${attempt + 1} invalid output:`,
            error instanceof Error ? error.message : error
          );
          continue;
        }

        lastTransientError = error;
        console.error(
          `[generateExecutiveReport] Model ${modelName} attempt ${attempt + 1} failed:`,
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
      "[generateExecutiveReport] Validation retries exhausted, using fallback.",
      lastValidationError
    );
    return {
      report: createFallbackExecutiveReport(),
      usedFallback: true,
      attempts: totalAttempts,
    };
  }

  console.error(
    "[generateExecutiveReport] All models and retries exhausted.",
    lastTransientError
  );

  throw new GeminiUnavailableError(
    "Gemini API is temporarily overloaded. We retried with backoff and alternate models — please wait a moment and try again."
  );
}
