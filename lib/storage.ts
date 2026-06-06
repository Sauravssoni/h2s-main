// PrepBuddy — Storage Helpers (localStorage only, zero server-side)

import type { JourneyEntry, JourneyStats, MascotName, StudentProfile, MentorSummary } from './types';
import {
  STORAGE_KEYS,
  LEGACY_JOURNEY_KEY,
  MAX_JOURNEY_ENTRIES,
  MASCOT_NAMES,
} from './constants';

// ─── Journal / Journey ────────────────────────────────────────────────────────

function isValidEntry(obj: unknown): obj is JourneyEntry {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'date' in obj &&
    'checkIn' in obj &&
    'plan' in obj
  );
}

export function loadJourneyEntries(): JourneyEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    // Migrate from legacy PrepBuddy key if present
    const legacy = localStorage.getItem(LEGACY_JOURNEY_KEY);
    const current = localStorage.getItem(STORAGE_KEYS.JOURNEY);
    const raw = current ?? legacy ?? null;

    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(isValidEntry);

    // If we migrated from legacy, save under new key and remove old
    if (legacy && !current) {
      localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(valid));
      localStorage.removeItem(LEGACY_JOURNEY_KEY);
    }

    return valid;
  } catch {
    return [];
  }
}

export function saveJourneyEntry(entry: JourneyEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadJourneyEntries();
    // Prepend newest entry, cap at MAX_JOURNEY_ENTRIES
    const updated = [entry, ...existing].slice(0, MAX_JOURNEY_ENTRIES);
    localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable (private mode quota exceeded etc)
  }
}

export function clearJourneyData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.JOURNEY);
  localStorage.removeItem(LEGACY_JOURNEY_KEY);
}

// ─── Journey Stats ────────────────────────────────────────────────────────────

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
}

/**
 * Compute streak from a sorted-desc array of ISO date strings.
 */
function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const expected = new Date(today);

  for (const dateStr of dates) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === expected.getTime()) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else if (d.getTime() > expected.getTime()) {
      // Future date or duplicate — skip
      continue;
    } else {
      break; // Gap found
    }
  }
  return streak;
}

export function computeJourneyStats(entries: JourneyEntry[]): JourneyStats {
  if (entries.length === 0) {
    return {
      streak: 0,
      totalCheckIns: 0,
      averageStress: 0,
      averageSleep: 0,
      averageConfidence: 0,
      averageEnergy: 0,
      mostCommonTriggers: [],
      moodTrend: [],
      improvementNote: '',
    };
  }

  const stressLevels = entries.map((e) => e.checkIn.stressLevel);
  const sleepLevels = entries.map((e) => e.checkIn.sleepQuality);
  const confidenceLevels = entries.map((e) => e.checkIn.confidenceLevel);
  const energyLevels = entries.map((e) => e.checkIn.energyLevel);

  // Deduplicate dates (take most recent per day for streak)
  const uniqueDates = [...new Set(entries.map((e) => e.date))].sort().reverse();
  const streak = computeStreak(uniqueDates);

  // Trigger frequency
  const triggerCounts: Record<string, number> = {};
  for (const entry of entries) {
    for (const trigger of entry.checkIn.triggers) {
      triggerCounts[trigger] = (triggerCounts[trigger] ?? 0) + 1;
    }
  }
  const mostCommonTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t) as JourneyStats['mostCommonTriggers'];

  // Mood trend (last 7 entries)
  const moodTrend = entries.slice(0, 7).map((e) => ({
    date: e.date,
    mood: e.checkIn.mood,
    stress: e.checkIn.stressLevel,
  }));

  // Improvement note
  const recentStress = stressLevels.slice(0, 3);
  const olderStress = stressLevels.slice(3, 6);
  let improvementNote = '';
  if (recentStress.length > 0 && olderStress.length > 0) {
    const recentAvg = avg(recentStress);
    const olderAvg = avg(olderStress);
    if (recentAvg < olderAvg - 0.5) {
      improvementNote = '📉 Your stress trend is improving over recent check-ins.';
    } else if (recentAvg > olderAvg + 0.5) {
      improvementNote = '📈 Stress appears to be rising. A lighter plan today may help.';
    } else {
      improvementNote = '↔ Stress levels have been consistent across your recent check-ins.';
    }
  }

  return {
    streak,
    totalCheckIns: entries.length,
    averageStress: avg(stressLevels),
    averageSleep: avg(sleepLevels),
    averageConfidence: avg(confidenceLevels),
    averageEnergy: avg(energyLevels),
    mostCommonTriggers,
    moodTrend,
    improvementNote,
  };
}

// ─── Mentor Summary ───────────────────────────────────────────────────────────

export function buildMentorSummary(entries: JourneyEntry[]): MentorSummary {
  if (entries.length === 0) {
    return {
      averageStress: 0,
      averageSleep: 0,
      averageConfidence: 0,
      topTriggers: [],
      recentReflectionSummary: 'No check-ins recorded yet.',
      recurringLoop: 'None detected.',
      suggestedSupport:
        'Student has not completed a check-in yet. Encourage them to start their first wellness check-in.',
    };
  }

  const stats = computeJourneyStats(entries);
  const recentEntry = entries[0];
  const recentLoop = recentEntry?.plan.detectedStressLoop;

  const loopFreq: Record<string, number> = {};
  for (const entry of entries) {
    const loop = entry.plan.detectedStressLoop;
    if (loop) {
      loopFreq[loop.name] = (loopFreq[loop.name] ?? 0) + 1;
    }
  }
  const recurringLoop =
    Object.entries(loopFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    recentLoop?.name ??
    'None detected';

  let suggestedSupport =
    'Over recent check-ins, the student may benefit from calm reassurance and consistent encouragement.';

  if (stats.averageStress >= 7) {
    suggestedSupport =
      'Stress appears consistently elevated. Calm check-ins, reduced performance pressure, and smaller revision targets may help significantly.';
  } else if (stats.averageSleep <= 5) {
    suggestedSupport =
      'Sleep quality is below average. Encouraging an earlier sleep schedule and reducing late-night discussion of exam pressure would be helpful.';
  } else if (stats.averageConfidence <= 4) {
    suggestedSupport =
      'Confidence appears low. Recognising small wins and avoiding score-focused questioning may help rebuild self-belief.';
  }

  return {
    averageStress: stats.averageStress,
    averageSleep: stats.averageSleep,
    averageConfidence: stats.averageConfidence,
    topTriggers: stats.mostCommonTriggers,
    recentReflectionSummary: recentEntry?.checkIn.reflection
      ? `Most recent reflection (${recentEntry.date}): "${recentEntry.checkIn.reflection.slice(0, 150)}${recentEntry.checkIn.reflection.length > 150 ? '…' : ''}"`
      : 'No reflection recorded in the most recent check-in.',
    recurringLoop,
    suggestedSupport,
  };
}

// ─── Profile / Mascot ─────────────────────────────────────────────────────────

export function loadProfile(): StudentProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {}
}

export function getOrAssignMascot(): MascotName {
  const profile = loadProfile();
  if (profile?.mascotName) return profile.mascotName;
  // Assign randomly
  const mascot = MASCOT_NAMES[Math.floor(Math.random() * MASCOT_NAMES.length)] ?? 'Calm Tiger';
  return mascot;
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem(LEGACY_JOURNEY_KEY);
}
