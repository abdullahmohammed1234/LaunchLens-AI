import { GoogleGenerativeAI } from "@google/generative-ai";
import type { MentorContextPackage } from "@/lib/ai/contextBuilder";
import { createFallbackMentorResponse } from "@/lib/ai/fallbackMentor";
import {
  GeminiQuotaError,
  GeminiUnavailableError,
  isQuotaError,
  isTransientError,
  isValidationError,
} from "@/lib/ai/errors";
import {
  buildMentorPrompt,
  type MentorPromptInput,
} from "@/lib/ai/prompts/mentorPrompt";
import { mentorResponseSchema, type MentorResponse } from "@/types/mentor";

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

async function callGemini(
  input: MentorPromptInput,
  attempt: number,
  modelName: string
): Promise<MentorResponse> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: attempt === 0 ? 0.4 : 0.2,
    },
  });

  const prompt = buildMentorPrompt(input, attempt);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = parseJsonResponse(text);
  return mentorResponseSchema.parse(parsed);
}

export interface GenerateMentorResponseInput {
  context: MentorContextPackage;
  question: string;
  topic: string;
}

export interface GenerateMentorResponseResult {
  response: MentorResponse;
  usedFallback: boolean;
  attempts: number;
  model?: string;
}

export async function generateMentorResponse(
  input: GenerateMentorResponseInput
): Promise<GenerateMentorResponseResult> {
  const models = getModelChain();
  let totalAttempts = 0;
  let lastValidationError: unknown;
  let lastTransientError: unknown;

  const promptInput: MentorPromptInput = {
    context: input.context,
    question: input.question,
    topic: input.topic,
  };

  for (const modelName of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      totalAttempts++;

      try {
        const response = await callGemini(promptInput, attempt, modelName);
        return {
          response,
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
          if (attempt < MAX_RETRIES) {
            await sleep(RETRY_DELAYS_MS[attempt] ?? 6000);
            continue;
          }
          break;
        }

        if (isValidationError(error)) {
          lastValidationError = error;
          continue;
        }

        lastTransientError = error;
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAYS_MS[attempt] ?? 4000);
        }
      }
    }
  }

  if (lastValidationError && !lastTransientError) {
    return {
      response: createFallbackMentorResponse(input.context, input.question),
      usedFallback: true,
      attempts: totalAttempts,
    };
  }

  throw new GeminiUnavailableError(
    "Gemini API is temporarily unavailable. Please wait a moment and try again."
  );
}
