// PrepBuddy — API Route: /api/generate-support
// Server-side only. Validates input, rate limits, runs engine/AI, returns safe output.

import { NextRequest, NextResponse } from 'next/server';
import { apiRequestSchema } from '@/lib/validation';
import { sanitizeText, checkRateLimit } from '@/lib/security';
import { generateWellnessPlan } from '@/lib/wellness-engine';
import { getAIPlan } from '@/lib/ai';
import { detectCrisisKeywords } from '@/lib/risk';
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from '@/lib/constants';
import type { StudentCheckInInput, ApiResponse, ApiError } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse | ApiError>> {
  // Rate limiting by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json<ApiError>(
      { success: false, error: 'Too many requests. Please wait a moment and try again.', code: 'RATE_LIMIT' },
      { status: 429 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiError>(
      { success: false, error: 'Invalid request body.', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }

  // Validate with Zod
  const parsed = apiRequestSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues;
    const firstError = issues[0]?.message ?? 'Invalid input';
    return NextResponse.json<ApiError>(
      { success: false, error: firstError, code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }

  const rawCheckIn = parsed.data.checkIn;

  // Sanitize text input
  const sanitizedReflection = sanitizeText(rawCheckIn.reflection ?? '');
  const safeCheckIn: StudentCheckInInput = {
    examType: rawCheckIn.examType as StudentCheckInInput['examType'],
    examPhase: rawCheckIn.examPhase as StudentCheckInInput['examPhase'],
    studyHoursPlanned: rawCheckIn.studyHoursPlanned,
    mood: rawCheckIn.mood as StudentCheckInInput['mood'],
    stressLevel: rawCheckIn.stressLevel,
    anxietyLevel: rawCheckIn.anxietyLevel,
    energyLevel: rawCheckIn.energyLevel,
    sleepQuality: rawCheckIn.sleepQuality,
    focusLevel: rawCheckIn.focusLevel,
    confidenceLevel: rawCheckIn.confidenceLevel,
    triggers: rawCheckIn.triggers as StudentCheckInInput['triggers'],
    reflection: sanitizedReflection,
  };

  // Crisis keyword detection — bypass AI, return safety plan immediately
  const isCrisis = detectCrisisKeywords(sanitizedReflection);

  // Generate deterministic plan (always)
  const deterministicPlan = generateWellnessPlan(safeCheckIn);

  // If not crisis, try to enhance with AI (optional)
  let finalPlan = deterministicPlan;
  if (!isCrisis) {
    try {
      const aiEnhancement = await getAIPlan(safeCheckIn);
      if (aiEnhancement) {
        finalPlan = {
          ...deterministicPlan,
          ...(aiEnhancement.reflectionInsight && {
            reflectionInsight: aiEnhancement.reflectionInsight,
          }),
          ...(aiEnhancement.examPhaseProtocol && {
            examPhaseProtocol: aiEnhancement.examPhaseProtocol,
          }),
        };
      }
    } catch {
      // AI failure is silently handled — fallback plan is used
    }
  }

  return NextResponse.json<ApiResponse>({ success: true, plan: finalPlan });
}

// Only POST is supported
export async function GET(): Promise<NextResponse<ApiError>> {
  return NextResponse.json<ApiError>(
    { success: false, error: 'Method not allowed.', code: 'INTERNAL_ERROR' },
    { status: 405 },
  );
}
