// PrepBuddy — Exam Timeline Tests
import { describe, it, expect } from 'vitest';
import {
  getDaysUntilExam,
  getTimelinePhase,
  getPaceMode,
  getTimelineAdvice,
  computeExamTimeline,
} from '../lib/exam-timeline';
import type { StudentCheckInInput } from '../lib/types';

// ─── Helper ────────────────────────────────────────────────────────────────────

function makeInput(overrides: Partial<StudentCheckInInput> = {}): StudentCheckInInput {
  return {
    examType: 'JEE',
    examPhase: 'Regular Prep',
    studyHoursPlanned: 6,
    mood: 'Okay',
    stressLevel: 5,
    anxietyLevel: 5,
    energyLevel: 6,
    sleepQuality: 7,
    focusLevel: 6,
    confidenceLevel: 6,
    triggers: [],
    reflection: '',
    ...overrides,
  };
}

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

// ─── getDaysUntilExam ──────────────────────────────────────────────────────────

describe('getDaysUntilExam', () => {
  it('returns null for undefined input', () => {
    expect(getDaysUntilExam(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getDaysUntilExam('')).toBeNull();
  });

  it('returns null for malformed date', () => {
    expect(getDaysUntilExam('not-a-date')).toBeNull();
    expect(getDaysUntilExam('2025/01/01')).toBeNull();
    expect(getDaysUntilExam('31-12-2025')).toBeNull();
  });

  it('returns 0 for today', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(getDaysUntilExam(today)).toBe(0);
  });

  it('returns positive number for future date', () => {
    const result = getDaysUntilExam(futureDate(30));
    expect(result).toBe(30);
  });

  it('returns negative number for past date', () => {
    const result = getDaysUntilExam(futureDate(-5));
    expect(result).toBeLessThan(0);
  });
});

// ─── getTimelinePhase ──────────────────────────────────────────────────────────

describe('getTimelinePhase', () => {
  it('returns Long Runway for 60+ days', () => {
    expect(getTimelinePhase(60, 'Regular Prep')).toBe('Long Runway');
    expect(getTimelinePhase(120, 'Regular Prep')).toBe('Long Runway');
  });

  it('returns Build Phase for 30–59 days', () => {
    expect(getTimelinePhase(30, 'Regular Prep')).toBe('Build Phase');
    expect(getTimelinePhase(59, 'Regular Prep')).toBe('Build Phase');
  });

  it('returns Revision Phase for 14–29 days', () => {
    expect(getTimelinePhase(14, 'Regular Prep')).toBe('Revision Phase');
    expect(getTimelinePhase(29, 'Regular Prep')).toBe('Revision Phase');
  });

  it('returns Final Sprint for 3–13 days', () => {
    expect(getTimelinePhase(3, 'Regular Prep')).toBe('Final Sprint');
    expect(getTimelinePhase(13, 'Regular Prep')).toBe('Final Sprint');
  });

  it('returns Exam Window for 0–2 days', () => {
    expect(getTimelinePhase(0, 'Regular Prep')).toBe('Exam Window');
    expect(getTimelinePhase(2, 'Regular Prep')).toBe('Exam Window');
  });

  it('returns Result Waiting for past exam date', () => {
    expect(getTimelinePhase(-1, 'Regular Prep')).toBe('Result Waiting');
  });

  it('overrides to Result Waiting for Result Waiting phase', () => {
    expect(getTimelinePhase(30, 'Result Waiting')).toBe('Result Waiting');
  });

  it('returns Unknown when daysLeft is null', () => {
    expect(getTimelinePhase(null, 'Regular Prep')).toBe('Unknown');
  });
});

// ─── getPaceMode ───────────────────────────────────────────────────────────────

describe('getPaceMode', () => {
  it('returns Recovery First for high stress (≥8)', () => {
    expect(getPaceMode(30, 8, 7, 6)).toBe('Recovery First');
    expect(getPaceMode(60, 9, 8, 8)).toBe('Recovery First');
  });

  it('returns Recovery First for low sleep (≤4)', () => {
    expect(getPaceMode(30, 5, 4, 6)).toBe('Recovery First');
    expect(getPaceMode(60, 3, 3, 8)).toBe('Recovery First');
  });

  it('returns Steady for 30+ days with normal stress', () => {
    expect(getPaceMode(30, 5, 7, 6)).toBe('Steady');
    expect(getPaceMode(60, 4, 8, 7)).toBe('Steady');
  });

  it('returns Tight but Manageable for 14–29 days with low confidence', () => {
    expect(getPaceMode(14, 5, 7, 3)).toBe('Tight but Manageable');
    expect(getPaceMode(20, 6, 6, 4)).toBe('Tight but Manageable');
  });

  it('returns Steady for 14–29 days with good confidence', () => {
    expect(getPaceMode(14, 5, 7, 7)).toBe('Steady');
  });

  it('returns Final Sprint for 3–13 days', () => {
    expect(getPaceMode(5, 5, 7, 6)).toBe('Final Sprint');
    expect(getPaceMode(13, 4, 6, 5)).toBe('Final Sprint');
  });

  it('returns Exam Window for 0–2 days', () => {
    expect(getPaceMode(0, 5, 7, 6)).toBe('Exam Window');
    expect(getPaceMode(2, 4, 6, 5)).toBe('Exam Window');
  });

  it('returns Steady for null daysLeft', () => {
    expect(getPaceMode(null, 5, 7, 6)).toBe('Steady');
  });
});

// ─── getTimelineAdvice ─────────────────────────────────────────────────────────

describe('getTimelineAdvice', () => {
  it('returns recovery advice for Recovery First pace', () => {
    const advice = getTimelineAdvice('Build Phase', 'Recovery First');
    expect(advice).toContain('Pace needs focus');
  });

  it('returns appropriate advice for each phase', () => {
    expect(getTimelineAdvice('Long Runway', 'Steady')).toContain('time');
    expect(getTimelineAdvice('Final Sprint', 'Final Sprint')).toContain('weak spots');
    expect(getTimelineAdvice('Exam Window', 'Exam Window')).toContain('Light revision');
    expect(getTimelineAdvice('Result Waiting', 'Steady')).toContain('result-checking');
  });

  it('returns fallback for unknown phase', () => {
    const advice = getTimelineAdvice('Unknown', 'Steady');
    expect(advice).toContain('sleep');
  });
});

// ─── computeExamTimeline ────────────────────────────────────────────────────────

describe('computeExamTimeline', () => {
  it('produces a complete timeline for valid date', () => {
    const input = makeInput({ examDate: futureDate(20) });
    const result = computeExamTimeline(input);

    expect(result.daysLeft).toBe(20);
    expect(result.timelinePhase).toBe('Revision Phase');
    expect(result.paceMode).toBe('Steady');
    expect(result.advice).toBeTruthy();
  });

  it('returns null daysLeft when no exam date', () => {
    const input = makeInput();
    const result = computeExamTimeline(input);

    expect(result.daysLeft).toBeNull();
    expect(result.timelinePhase).toBe('Unknown');
  });

  it('forces Recovery First for stressed student', () => {
    const input = makeInput({ examDate: futureDate(30), stressLevel: 9, sleepQuality: 3 });
    const result = computeExamTimeline(input);

    expect(result.paceMode).toBe('Recovery First');
    expect(result.advice).toContain('focus');
  });

  it('handles Result Waiting exam phase', () => {
    const input = makeInput({ examPhase: 'Result Waiting', examDate: futureDate(10) });
    const result = computeExamTimeline(input);

    expect(result.timelinePhase).toBe('Result Waiting');
  });
});
