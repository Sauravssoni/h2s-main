// PrepBuddy — Exam Timeline Engine
// Pure functions for computing timeline-based pace advice.

import type { ExamPhase, StudentCheckInInput, ExamTimeline } from './types';

/** Parse a YYYY-MM-DD string and return days until that date, or null if invalid. */
export function getDaysUntilExam(examDate: string | undefined): number | null {
  if (!examDate) return null;

  const match = /^\d{4}-\d{2}-\d{2}$/.exec(examDate);
  if (!match) return null;

  const target = new Date(`${examDate}T00:00:00`);
  if (isNaN(target.getTime())) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

/** Map days-left to a human-readable timeline phase. */
export function getTimelinePhase(daysLeft: number | null, examPhase: ExamPhase): string {
  if (examPhase === 'Result Waiting') return 'Result Waiting';
  if (daysLeft === null) return 'Unknown';

  if (daysLeft >= 60) return 'Long Runway';
  if (daysLeft >= 30) return 'Build Phase';
  if (daysLeft >= 14) return 'Revision Phase';
  if (daysLeft >= 3) return 'Final Sprint';
  if (daysLeft >= 0) return 'Exam Window';

  // Past exam date
  return 'Result Waiting';
}

/** Determine pace mode based on timeline + wellness signals. */
export function getPaceMode(
  daysLeft: number | null,
  stressLevel: number,
  sleepQuality: number,
  confidenceLevel: number,
): string {
  // Safety override: high stress or poor sleep always triggers recovery
  if (stressLevel >= 8 || sleepQuality <= 4) {
    return 'Recovery First';
  }

  if (daysLeft === null) return 'Steady';

  if (daysLeft >= 30) return 'Steady';
  if (daysLeft >= 14) {
    return confidenceLevel <= 4 ? 'Tight but Manageable' : 'Steady';
  }
  if (daysLeft >= 3) return 'Final Sprint';
  return 'Exam Window';
}

/** Generate safe, non-panic advice for the given phase and pace. */
export function getTimelineAdvice(phase: string, paceMode: string): string {
  if (paceMode === 'Recovery First') {
    return 'Protect sleep while narrowing targets. Pace needs focus, not panic.';
  }

  switch (phase) {
    case 'Long Runway':
      return 'You have time. Build strong foundations with consistent daily blocks.';
    case 'Build Phase':
      return 'Deepen understanding on core topics. Alternate revision with practice problems.';
    case 'Revision Phase':
      return 'Do not expand resources now. Pick one revision list and one mock-analysis block.';
    case 'Final Sprint':
      return 'Narrow to weak spots only. One mock review and one focused revision block per day.';
    case 'Exam Window':
      return 'Light revision only. Focus on sleep, nutrition, and calm. You have prepared enough.';
    case 'Result Waiting':
      return 'Set one result-checking window per day. Outside that window, engage in a routine activity.';
    default:
      return 'Stay consistent and protect your sleep.';
  }
}

/** Compute the full ExamTimeline object from input. */
export function computeExamTimeline(input: StudentCheckInInput): ExamTimeline {
  const daysLeft = getDaysUntilExam(input.examDate);
  const timelinePhase = getTimelinePhase(daysLeft, input.examPhase);
  const paceMode = getPaceMode(daysLeft, input.stressLevel, input.sleepQuality, input.confidenceLevel);
  const advice = getTimelineAdvice(timelinePhase, paceMode);

  return {
    examDate: input.examDate,
    daysLeft,
    timelinePhase,
    paceMode,
    advice,
  };
}
