// PrepBuddy — Risk Detection Tests
import { describe, it, expect } from 'vitest';
import {
  detectCrisisKeywords,
  detectElevatedRisk,
  getSupportLevel,
  detectSomaticSignals,
  detectGuiltSignals,
  detectIsolationSignals,
  detectToxicHustle,
  detectImposterRevision,
  detectRankSelfWorth,
  detectExamFreeze,
} from '../lib/risk';

describe('detectCrisisKeywords', () => {
  it('returns true for direct crisis phrase', () => {
    expect(detectCrisisKeywords('I want to kill myself')).toBe(true);
  });

  it('returns true for suicide keyword', () => {
    expect(detectCrisisKeywords('I have been thinking about suicide')).toBe(true);
  });

  it('returns true for life over phrase', () => {
    expect(detectCrisisKeywords('My life is over')).toBe(true);
  });

  it('returns true for self harm phrase', () => {
    expect(detectCrisisKeywords('I want to hurt myself')).toBe(true);
  });

  it('returns false for normal exam stress text', () => {
    expect(detectCrisisKeywords('I am really stressed about my mock test today')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(detectCrisisKeywords('')).toBe(false);
  });

  it('is case insensitive', () => {
    expect(detectCrisisKeywords('I WANT TO END MY LIFE')).toBe(true);
  });

  it('returns false for non-matching text', () => {
    expect(detectCrisisKeywords('Today I studied chapters 3 and 4')).toBe(false);
  });
});

describe('detectElevatedRisk', () => {
  it('returns true for high stress + low sleep', () => {
    expect(detectElevatedRisk(9, 5, 3, '')).toBe(true);
  });

  it('returns true for maximum stress and anxiety', () => {
    expect(detectElevatedRisk(10, 10, 5, '')).toBe(true);
  });

  it('returns true when reflection contains crisis keywords', () => {
    expect(detectElevatedRisk(4, 3, 8, 'I want to end it all')).toBe(true);
  });

  it('returns false for moderate normal values', () => {
    expect(detectElevatedRisk(5, 4, 7, 'Feeling okay today')).toBe(false);
  });
});

describe('getSupportLevel', () => {
  it('returns crisis for crisis keywords in reflection', () => {
    expect(getSupportLevel(5, 5, 'Okay', 'I want to die')).toBe('crisis');
  });

  it('returns crisis for extreme stress + anxiety', () => {
    expect(getSupportLevel(9, 9, 'Stressed', '')).toBe('crisis');
  });

  it('returns elevated for overwhelmed mood', () => {
    expect(getSupportLevel(6, 6, 'Overwhelmed', '')).toBe('elevated');
  });

  it('returns elevated for high stress', () => {
    expect(getSupportLevel(8, 5, 'Stressed', '')).toBe('elevated');
  });

  it('returns normal for calm, low-stress check-in', () => {
    expect(getSupportLevel(3, 2, 'Calm', 'Had a good study session today')).toBe('normal');
  });
});

describe('detectSomaticSignals', () => {
  it('detects chest tightness', () => {
    expect(detectSomaticSignals('I feel chest tight and anxious')).toBe(true);
  });

  it('detects panic attack', () => {
    expect(detectSomaticSignals('I had a panic attack before the exam')).toBe(true);
  });

  it('returns false for normal text', () => {
    expect(detectSomaticSignals('I am tired from studying')).toBe(false);
  });
});

describe('detectGuiltSignals', () => {
  it('detects money-related guilt', () => {
    expect(detectGuiltSignals('My parents spent so much money on coaching fees')).toBe(true);
  });

  it('detects sacrifice language', () => {
    expect(detectGuiltSignals('they have sacrificed so much for me')).toBe(true);
  });

  it('returns false for unrelated text', () => {
    expect(detectGuiltSignals('I studied well today')).toBe(false);
  });
});

describe('detectIsolationSignals', () => {
  it('detects lonely phrase', () => {
    expect(detectIsolationSignals('I feel so alone and isolated')).toBe(true);
  });

  it('detects nobody phrase', () => {
    expect(detectIsolationSignals('nobody understands what I am going through')).toBe(true);
  });

  it('returns false for normal text', () => {
    expect(detectIsolationSignals('I was studying with my friends today')).toBe(false);
  });
});

describe('detectToxicHustle', () => {
  it('detects excessive study hours', () => {
    expect(detectToxicHustle('I study 16 hours every day to get rank 1')).toBe(true);
  });

  it('detects guilty resting phrase', () => {
    expect(detectToxicHustle('I feel guilty resting even for 5 minutes')).toBe(true);
  });

  it('returns false for reasonable text', () => {
    expect(detectToxicHustle('I took a break and felt refreshed')).toBe(false);
  });
});

describe('detectImposterRevision', () => {
  it('detects forgot everything phrase', () => {
    expect(detectImposterRevision('I feel like I forgot everything I studied')).toBe(true);
  });

  it('detects nothing sticks phrase', () => {
    expect(detectImposterRevision('nothing sticks no matter how much I study')).toBe(true);
  });

  it('returns false for confident text', () => {
    expect(detectImposterRevision('I revised chapter 5 and it went well')).toBe(false);
  });
});

describe('detectRankSelfWorth', () => {
  it('detects worthless phrase', () => {
    expect(detectRankSelfWorth('I feel worthless if I do not get a good rank')).toBe(true);
  });

  it('detects failure phrase', () => {
    expect(detectRankSelfWorth('I am such a failure for not getting good marks')).toBe(true);
  });

  it('returns false for motivating text', () => {
    expect(detectRankSelfWorth('I will try again and do better next time')).toBe(false);
  });
});

describe('detectExamFreeze', () => {
  it('detects blanked out phrase', () => {
    expect(detectExamFreeze('I blanked out when I saw the first question')).toBe(true);
  });

  it('detects went blank phrase', () => {
    expect(detectExamFreeze('my mind went blank during the paper')).toBe(true);
  });

  it('returns false for normal exam account', () => {
    expect(detectExamFreeze('I attempted 60 questions in the exam')).toBe(false);
  });
});
