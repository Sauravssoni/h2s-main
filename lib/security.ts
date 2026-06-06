// PrepBuddy — Security helpers (server-safe)
import { MAX_REFLECTION_LENGTH, MAX_TRIGGERS } from './constants';

/** Strip HTML tags and trim whitespace */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // remove HTML tags
    .replace(/[^\w\s.,!?'"()\-–—@#%&*+=/\\:;]/g, '') // keep safe chars
    .trim()
    .slice(0, MAX_REFLECTION_LENGTH);
}

/** Normalise a number between min and max */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/** Cap a string array to maxLength unique items */
export function capArray<T>(arr: T[], maxLength: number): T[] {
  return [...new Set(arr)].slice(0, maxLength);
}

/** Return only allowed values from an enum array */
export function filterEnum<T extends string>(
  input: unknown[],
  allowed: readonly T[],
): T[] {
  return input.filter((v): v is T => allowed.includes(v as T));
}

/** Simple in-memory rate limiter (per IP, resets after window) */
const rateLimitMap = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(
  ip: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= maxRequests) {
    return false; // rate limited
  }

  entry.count += 1;
  return true; // allowed
}

/** Mask stack traces in error messages */
export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Return only the first line of the message, never the stack
    return error.message.split('\n')[0] ?? 'An error occurred';
  }
  return 'An unexpected error occurred';
}

/** Validate that no client-side secrets are exposed */
export function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error('This module must only be used on the server');
  }
}

/** Cap triggers array to safe limit */
export function capTriggers(triggers: string[]): string[] {
  return capArray(triggers, MAX_TRIGGERS);
}
