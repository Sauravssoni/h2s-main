// PrepBuddy — Utility Helpers
import type { StudentCheckInInput, MascotName } from './types';
import { MASCOT_EMOJI } from './constants';

export function generateId(): string {
  return `prepbuddy-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return isoDate;
  }
}

export function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function getMascotDisplay(name: MascotName): string {
  return `${MASCOT_EMOJI[name] ?? '🌟'} ${name}`;
}

// Sample student for demo
export const SAMPLE_STUDENT_INPUT: Readonly<StudentCheckInInput> = {
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
  triggers: ['Mock test score', 'Syllabus backlog', 'Comparison with friends', 'Parental pressure'],
  reflection:
    "I feel like everyone is ahead of me and my mock score is not improving. I don't understand how to fix this. I keep restarting topics but nothing sticks.",
} as const;
