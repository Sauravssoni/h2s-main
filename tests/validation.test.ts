import { describe, it, expect } from 'vitest';
import { studentCheckInSchema, safeParseCheckIn, clampScale } from '../lib/validation';

const validInput = {
  examType: 'JEE',
  examPhase: 'Mock Test Week',
  studyHoursPlanned: 8,
  mood: 'Anxious',
  stressLevel: 8,
  anxietyLevel: 7,
  energyLevel: 4,
  sleepQuality: 5,
  focusLevel: 5,
  confidenceLevel: 3,
  triggers: ['Mock test score', 'Syllabus backlog'],
  reflection: 'Feeling very overwhelmed today.',
};

describe('studentCheckInSchema', () => {
  it('accepts a fully valid input', () => {
    const result = studentCheckInSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid exam type', () => {
    const result = studentCheckInSchema.safeParse({
      ...validInput,
      examType: 'INVALID_EXAM',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a stress level above 10', () => {
    const result = studentCheckInSchema.safeParse({
      ...validInput,
      stressLevel: 11,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a stress level below 1', () => {
    const result = studentCheckInSchema.safeParse({
      ...validInput,
      stressLevel: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects study hours above 16', () => {
    const result = studentCheckInSchema.safeParse({
      ...validInput,
      studyHoursPlanned: 20,
    });
    expect(result.success).toBe(false);
  });

  it('accepts study hours of 0 (rest day)', () => {
    const result = studentCheckInSchema.safeParse({
      ...validInput,
      studyHoursPlanned: 0,
    });
    expect(result.success).toBe(true);
  });

  it('caps trigger arrays at max 14', () => {
    const tooManyTriggers = [
      'Mock test score',
      'Syllabus backlog',
      'Parental pressure',
      'Comparison with friends',
      'Social media distraction',
      'Sleep loss',
      'Fear of failure',
      'Result uncertainty',
      'Time management',
      'Health issue',
      'Financial pressure',
      'Loneliness',
      'Too many resources',
      'Coaching pressure',
      'Mock test score', // duplicate to exceed 14 if deduplicated
    ];
    const result = studentCheckInSchema.safeParse({
      ...validInput,
      triggers: tooManyTriggers,
    });
    // Should fail (more than 14)
    expect(result.success).toBe(false);
  });

  it('truncates reflection at 1000 chars via safeParseCheckIn + long string', () => {
    const longReflection = 'a'.repeat(1001);
    const result = studentCheckInSchema.safeParse({
      ...validInput,
      reflection: longReflection,
    });
    expect(result.success).toBe(false);
  });

  it('defaults reflection to empty string when omitted', () => {
    const { reflection: _reflection, ...withoutReflection } = validInput;
    void _reflection;
    const result = studentCheckInSchema.safeParse(withoutReflection);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.reflection).toBe('');
    }
  });
});

describe('safeParseCheckIn', () => {
  it('returns parsed object for valid input', () => {
    const result = safeParseCheckIn(validInput);
    expect(result).not.toBeNull();
    expect(result?.examType).toBe('JEE');
  });

  it('returns null for invalid input', () => {
    expect(safeParseCheckIn({ examType: 'INVALID' })).toBeNull();
    expect(safeParseCheckIn(null)).toBeNull();
    expect(safeParseCheckIn(undefined)).toBeNull();
    expect(safeParseCheckIn(42)).toBeNull();
  });
});

describe('clampScale', () => {
  it('clamps to 1 for values below min', () => {
    expect(clampScale(0)).toBe(1);
    expect(clampScale(-5)).toBe(1);
  });

  it('clamps to 10 for values above max', () => {
    expect(clampScale(11)).toBe(10);
    expect(clampScale(100)).toBe(10);
  });

  it('passes through valid values', () => {
    expect(clampScale(5)).toBe(5);
    expect(clampScale(1)).toBe(1);
    expect(clampScale(10)).toBe(10);
  });

  it('uses fallback for NaN', () => {
    expect(clampScale(NaN)).toBe(5);
    expect(clampScale('hello' as unknown as number, 7)).toBe(7);
  });
});
