// PrepBuddy — Buddy Notes Tests
import { describe, it, expect } from 'vitest';
import { generateBuddyNotes } from '../lib/buddy-notes';
import type { StudentCheckInInput, WellnessPlan, ExamTimeline } from '../lib/types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

function makePlan(overrides: Partial<WellnessPlan> = {}): WellnessPlan {
  return {
    snapshot: {
      status: 'Balanced',
      statusColor: 'green',
      mood: 'Okay',
      stressLevel: 5,
      energyLevel: 6,
      confidenceLevel: 6,
      sleepQuality: 7,
      summary: 'Test plan',
    },
    triggerAnalysis: { topTriggers: [], triggerSummary: '', actionMap: {} as Record<string, string> },
    resetSteps: [],
    studyRecoveryPlan: { intensityRecommendation: '', sessionBlocks: [], recoveryAction: '', avoidList: [] },
    reflectionInsight: '',
    calmExercise: { name: '', description: '', steps: [], duration: '' },
    safetySupport: { level: 'normal', message: '', showCrisisCard: false, resources: [], panicToPlan: null },
    examPhaseProtocol: '',
    detectedStressLoop: null,
    detectedPainPoints: [],
    evidenceItems: [],
    generatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── Basic structure ───────────────────────────────────────────────────────────

describe('generateBuddyNotes — structure', () => {
  it('returns between 3 and 5 notes', () => {
    const notes = generateBuddyNotes(makeInput(), makePlan(), null);
    expect(notes.length).toBeGreaterThanOrEqual(3);
    expect(notes.length).toBeLessThanOrEqual(5);
  });

  it('each note has id, text, and reason', () => {
    const notes = generateBuddyNotes(makeInput(), makePlan(), null);
    for (const note of notes) {
      expect(note.id).toBeTruthy();
      expect(note.text).toBeTruthy();
      expect(note.reason).toBeTruthy();
    }
  });

  it('notes are short (under 120 chars)', () => {
    const input = makeInput({
      stressLevel: 9,
      sleepQuality: 3,
      confidenceLevel: 2,
      triggers: ['Mock test score', 'Syllabus backlog', 'Comparison with friends'],
    });
    const notes = generateBuddyNotes(input, makePlan(), null);
    for (const note of notes) {
      expect(note.text.length).toBeLessThanOrEqual(120);
    }
  });
});

// ─── Trigger-based notes ───────────────────────────────────────────────────────

describe('generateBuddyNotes — triggers', () => {
  it('includes mock score note for Mock test score trigger', () => {
    const input = makeInput({ triggers: ['Mock test score'] });
    const notes = generateBuddyNotes(input, makePlan(), null);
    const mockNote = notes.find((n) => n.reason === 'mock-score-trigger');
    expect(mockNote).toBeDefined();
    expect(mockNote!.text).toContain('compass');
  });

  it('includes backlog note for Syllabus backlog trigger', () => {
    const input = makeInput({ triggers: ['Syllabus backlog'] });
    const notes = generateBuddyNotes(input, makePlan(), null);
    const note = notes.find((n) => n.reason === 'backlog-trigger');
    expect(note).toBeDefined();
    expect(note!.text).toContain('topic');
  });

  it('includes comparison note for Comparison trigger', () => {
    const input = makeInput({ triggers: ['Comparison with friends'] });
    const notes = generateBuddyNotes(input, makePlan(), null);
    const note = notes.find((n) => n.reason === 'comparison-trigger');
    expect(note).toBeDefined();
  });

  it('includes sleep note for low sleep quality', () => {
    const input = makeInput({ sleepQuality: 3 });
    const notes = generateBuddyNotes(input, makePlan(), null);
    const note = notes.find((n) => n.reason === 'sleep-quality');
    expect(note).toBeDefined();
    expect(note!.text).toContain('rest');
  });

  it('includes parental pressure note', () => {
    const input = makeInput({ triggers: ['Parental pressure'] });
    const notes = generateBuddyNotes(input, makePlan(), null);
    const note = notes.find((n) => n.reason === 'parental-pressure');
    expect(note).toBeDefined();
  });
});

// ─── Crisis mode ───────────────────────────────────────────────────────────────

describe('generateBuddyNotes — crisis mode', () => {
  it('returns safety-only notes for crisis keywords in reflection', () => {
    const input = makeInput({ reflection: 'I want to end my life' });
    const notes = generateBuddyNotes(input, makePlan(), null);
    expect(notes.length).toBe(3);
    expect(notes.every((n) => n.reason === 'crisis-safety')).toBe(true);
  });

  it('returns safety-only notes for crisis support level', () => {
    const plan = makePlan({
      safetySupport: {
        level: 'crisis',
        message: '',
        showCrisisCard: true,
        resources: [],
        panicToPlan: null,
      },
    });
    const notes = generateBuddyNotes(makeInput(), plan, null);
    expect(notes.every((n) => n.reason === 'crisis-safety')).toBe(true);
  });

  it('does not include productivity affirmations in crisis mode', () => {
    const input = makeInput({
      reflection: 'I want to die',
      triggers: ['Mock test score', 'Syllabus backlog'],
    });
    const notes = generateBuddyNotes(input, makePlan(), null);
    const productivityNotes = notes.filter(
      (n) => n.reason === 'mock-score-trigger' || n.reason === 'backlog-trigger',
    );
    expect(productivityNotes.length).toBe(0);
  });
});

// ─── Timeline-aware notes ──────────────────────────────────────────────────────

describe('generateBuddyNotes — timeline', () => {
  it('includes recovery pace note when timeline is Recovery First', () => {
    const timeline: ExamTimeline = {
      daysLeft: 20,
      timelinePhase: 'Revision Phase',
      paceMode: 'Recovery First',
      advice: 'rest',
    };
    const input = makeInput({ stressLevel: 9, sleepQuality: 3 });
    const notes = generateBuddyNotes(input, makePlan(), timeline);
    const note = notes.find((n) => n.reason === 'timeline-pace');
    expect(note).toBeDefined();
  });

  it('includes runway note for Long Runway phase', () => {
    const timeline: ExamTimeline = {
      daysLeft: 90,
      timelinePhase: 'Long Runway',
      paceMode: 'Steady',
      advice: 'build',
    };
    const notes = generateBuddyNotes(makeInput(), makePlan(), timeline);
    const note = notes.find((n) => n.reason === 'timeline-runway');
    expect(note).toBeDefined();
  });

  it('includes sprint note for Final Sprint phase', () => {
    const timeline: ExamTimeline = {
      daysLeft: 5,
      timelinePhase: 'Final Sprint',
      paceMode: 'Final Sprint',
      advice: 'narrow',
    };
    const notes = generateBuddyNotes(makeInput(), makePlan(), timeline);
    const note = notes.find((n) => n.reason === 'timeline-sprint');
    expect(note).toBeDefined();
  });
});

// ─── Stress loop detection ─────────────────────────────────────────────────────

describe('generateBuddyNotes — stress loops', () => {
  it('includes awareness note when stress loop is detected', () => {
    const plan = makePlan({
      detectedStressLoop: {
        id: 'score-rumination',
        name: 'Score Rumination',
        chain: 'test',
        action: 'test',
      },
    });
    const notes = generateBuddyNotes(makeInput(), plan, null);
    const note = notes.find((n) => n.reason === 'stress-loop-detected');
    expect(note).toBeDefined();
    expect(note!.text).toContain('loop');
  });
});
