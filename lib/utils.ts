// PrepBuddy — Utility Helpers
import type { MascotName } from './types';
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
