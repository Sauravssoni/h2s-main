import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveJourneyEntry,
  loadJourneyEntries,
  clearJourneyData,
  computeJourneyStats,
} from '../lib/storage';
import type { JourneyEntry } from '../lib/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Helper to create a minimal journey entry
function makeEntry(date: string, stress = 5, sleep = 6): JourneyEntry {
  return {
    id: `test-${date}`,
    date,
    checkIn: {
      examType: 'JEE',
      examPhase: 'Regular Prep',
      studyHoursPlanned: 6,
      mood: 'Okay',
      stressLevel: stress,
      anxietyLevel: stress,
      energyLevel: 6,
      sleepQuality: sleep,
      focusLevel: 6,
      confidenceLevel: 5,
      triggers: ['Syllabus backlog'],
      reflection: '',
    },
    plan: {} as JourneyEntry['plan'],
  };
}

describe('loadJourneyEntries', () => {
  beforeEach(() => localStorageMock.clear());

  it('returns empty array when nothing is stored', () => {
    const entries = loadJourneyEntries();
    expect(entries).toEqual([]);
  });

  it('returns empty array when stored value is not an array', () => {
    localStorageMock.setItem('prepbuddy:v1:checkins', JSON.stringify({ not: 'an array' }));
    expect(loadJourneyEntries()).toEqual([]);
  });

  it('returns empty array for invalid JSON', () => {
    localStorageMock.setItem('prepbuddy:v1:checkins', 'not-valid-json');
    expect(loadJourneyEntries()).toEqual([]);
  });
});

describe('saveJourneyEntry + loadJourneyEntries', () => {
  beforeEach(() => localStorageMock.clear());

  it('saves and retrieves a single entry', () => {
    const entry = makeEntry('2025-01-01');
    saveJourneyEntry(entry);
    const loaded = loadJourneyEntries();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe('test-2025-01-01');
  });

  it('prepends new entries (most recent first)', () => {
    saveJourneyEntry(makeEntry('2025-01-01'));
    saveJourneyEntry(makeEntry('2025-01-02'));
    const loaded = loadJourneyEntries();
    expect(loaded[0]?.date).toBe('2025-01-02');
    expect(loaded[1]?.date).toBe('2025-01-01');
  });
});

describe('clearJourneyData', () => {
  beforeEach(() => {
    localStorageMock.clear();
    saveJourneyEntry(makeEntry('2025-01-01'));
  });

  it('clears all stored entries', () => {
    clearJourneyData();
    expect(loadJourneyEntries()).toEqual([]);
  });
});

describe('computeJourneyStats', () => {
  // Helper to get local date string (YYYY-MM-DD) for N days ago
  function daysAgo(n: number): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  it('returns zero-state for empty entries', () => {
    const stats = computeJourneyStats([]);
    expect(stats.totalCheckIns).toBe(0);
    expect(stats.streak).toBe(0);
    expect(stats.mostCommonTriggers).toEqual([]);
  });

  it('computes correct average stress', () => {
    const entries = [
      makeEntry(daysAgo(2), 6),
      makeEntry(daysAgo(1), 8),
      makeEntry(daysAgo(0), 4),
    ];
    const stats = computeJourneyStats(entries);
    expect(stats.averageStress).toBe(6);
  });

  it('computes streak of 1 for a single entry today', () => {
    const stats = computeJourneyStats([makeEntry(daysAgo(0))]);
    expect(stats.streak).toBe(1);
  });

  it('computes streak of 3 for 3 consecutive days', () => {
    const entries = [
      makeEntry(daysAgo(0)),
      makeEntry(daysAgo(1)),
      makeEntry(daysAgo(2)),
    ];
    const stats = computeJourneyStats(entries);
    expect(stats.streak).toBe(3);
  });

  it('stops streak count on gap', () => {
    const entries = [
      makeEntry(daysAgo(0)),
      makeEntry(daysAgo(2)), // gap: skipped day 1
      makeEntry(daysAgo(3)),
    ];
    const stats = computeJourneyStats(entries);
    expect(stats.streak).toBe(1);
  });

  it('includes most common triggers', () => {
    const entry1 = makeEntry(daysAgo(1));
    const entry2 = makeEntry(daysAgo(0));
    entry1.checkIn.triggers = ['Mock test score', 'Syllabus backlog'];
    entry2.checkIn.triggers = ['Mock test score', 'Parental pressure'];
    const stats = computeJourneyStats([entry2, entry1]);
    expect(stats.mostCommonTriggers[0]).toBe('Mock test score');
  });
});

