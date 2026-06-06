// PrepBuddy — Zod Validation Schemas
import { z } from 'zod';
import {
  EXAM_TYPES,
  EXAM_PHASES,
  MOOD_LABELS,
  STRESS_TRIGGERS,
  MAX_REFLECTION_LENGTH,
  MAX_TRIGGERS,
  MIN_SCALE,
  MAX_SCALE,
  MAX_STUDY_HOURS,
} from './constants';

export const studentCheckInSchema = z.object({
  examType: z.enum(EXAM_TYPES as [string, ...string[]]),
  examPhase: z.enum(EXAM_PHASES as [string, ...string[]]),
  studyHoursPlanned: z
    .number()
    .min(0, 'Study hours cannot be negative')
    .max(MAX_STUDY_HOURS, `Study hours cannot exceed ${MAX_STUDY_HOURS}`)
    .int('Study hours must be a whole number'),
  mood: z.enum(MOOD_LABELS as [string, ...string[]]),
  stressLevel: z
    .number()
    .min(MIN_SCALE)
    .max(MAX_SCALE)
    .int(),
  anxietyLevel: z
    .number()
    .min(MIN_SCALE)
    .max(MAX_SCALE)
    .int(),
  energyLevel: z
    .number()
    .min(MIN_SCALE)
    .max(MAX_SCALE)
    .int(),
  sleepQuality: z
    .number()
    .min(MIN_SCALE)
    .max(MAX_SCALE)
    .int(),
  focusLevel: z
    .number()
    .min(MIN_SCALE)
    .max(MAX_SCALE)
    .int(),
  confidenceLevel: z
    .number()
    .min(MIN_SCALE)
    .max(MAX_SCALE)
    .int(),
  triggers: z
    .array(z.enum(STRESS_TRIGGERS as [string, ...string[]]))
    .max(MAX_TRIGGERS, `Cannot select more than ${MAX_TRIGGERS} triggers`),
  reflection: z
    .string()
    .max(MAX_REFLECTION_LENGTH, `Reflection must be under ${MAX_REFLECTION_LENGTH} characters`)
    .optional()
    .default(''),
  examDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Exam date must be in YYYY-MM-DD format')
    .refine((val) => !isNaN(new Date(`${val}T00:00:00`).getTime()), 'Invalid date')
    .optional(),
});

export type ValidatedCheckIn = z.infer<typeof studentCheckInSchema>;

export const apiRequestSchema = z.object({
  checkIn: studentCheckInSchema,
});

/** Safely parse and return the validated object or null */
export function safeParseCheckIn(raw: unknown): ValidatedCheckIn | null {
  const result = studentCheckInSchema.safeParse(raw);
  if (result.success) return result.data;
  return null;
}

/** Clamp a number between min and max */
export function clampScale(value: unknown, fallback = 5): number {
  const n = Number(value);
  if (isNaN(n)) return fallback;
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.round(n)));
}
