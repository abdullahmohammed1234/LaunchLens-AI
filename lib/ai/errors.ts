export class GeminiQuotaError extends Error {
  readonly status = 429;

  constructor(
    message = "Gemini API quota exceeded. Check your plan, billing, or try again later."
  ) {
    super(message);
    this.name = "GeminiQuotaError";
  }
}

export class GeminiUnavailableError extends Error {
  readonly status = 503;

  constructor(
    message = "Gemini API is temporarily unavailable due to high demand. Please try again in a few moments."
  ) {
    super(message);
    this.name = "GeminiUnavailableError";
  }
}

function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    return (error as { status: number }).status;
  }
  return undefined;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message.toLowerCase() : "";
}

export function isQuotaError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status === 429) return true;

  const msg = getErrorMessage(error);
  return msg.includes("429") || msg.includes("quota exceeded");
}

export function isTransientError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status === 503 || status === 502 || status === 500) return true;

  const msg = getErrorMessage(error);
  return (
    msg.includes("503") ||
    msg.includes("502") ||
    msg.includes("high demand") ||
    msg.includes("service unavailable") ||
    msg.includes("temporarily unavailable")
  );
}

export function isValidationError(error: unknown): boolean {
  if (error instanceof SyntaxError) return true;
  if (error && typeof error === "object" && "name" in error) {
    return (error as { name: string }).name === "ZodError";
  }
  const msg = getErrorMessage(error);
  return (
    msg.includes("json") ||
    msg.includes("unexpected token") ||
    msg.includes("empty response")
  );
}
