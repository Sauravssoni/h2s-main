// PrepBuddy — Wellness Engine Tests
import { describe, it, expect } from 'vitest';
import { generateWellnessPlan, detectStressLoop, detectPainPoints } from '../lib/wellness-engine';
import type { StudentCheckInInput } from '../lib/types';

const baseInput: StudentCheckInInput = {
  examType: 'JEE',
  examPhase: 'Regular Prep',
  studyHoursPlanned: 8,
  mood: 'Okay',
  stressLevel: 5,
  anxietyLevel: 5,
  energyLevel: 6,
  sleepQuality: 6,
  focusLevel: 6,
  confidenceLevel: 6,
  triggers: [],
  reflection: '',
};

const highStressInput: StudentCheckInInput = {
  ...baseInput,
  mood: 'Overwhelmed',
  stressLevel: 9,
  anxietyLevel: 9,
  energyLevel: 2,
  sleepQuality: 2,
  focusLevel: 2,
  confidenceLevel: 2,
  triggers: ['Mock test score', 'Syllabus backlog', 'Comparison with friends', 'Parental pressure'],
  reflection: 'I feel like I am falling behind everyone.',
};

const crisisInput: StudentCheckInInput = {
  ...baseInput,
  mood: 'Overwhelmed',
  stressLevel: 10,
  anxietyLevel: 10,
  reflection: 'I want to end my life',
};

describe('generateWellnessPlan — structure', () => {
  it('returns a plan with all required fields', () => {
    const plan = generateWellnessPlan(baseInput);
    expect(plan).toHaveProperty('snapshot');
    expect(plan).toHaveProperty('triggerAnalysis');
    expect(plan).toHaveProperty('resetSteps');
    expect(plan).toHaveProperty('studyRecoveryPlan');
    expect(plan).toHaveProperty('reflectionInsight');
    expect(plan).toHaveProperty('calmExercise');
    expect(plan).toHaveProperty('safetySupport');
    expect(plan).toHaveProperty('examPhaseProtocol');
    expect(plan).toHaveProperty('detectedStressLoop');
    expect(plan).toHaveProperty('detectedPainPoints');
    expect(plan).toHaveProperty('evidenceItems');
    expect(plan).toHaveProperty('generatedAt');
  });

  it('has valid ISO timestamp', () => {
    const plan = generateWellnessPlan(baseInput);
    expect(new Date(plan.generatedAt).toISOString()).toBe(plan.generatedAt);
  });
});

describe('generateWellnessPlan — snapshot', () => {
  it('gives Balanced status for calm input', () => {
    const plan = generateWellnessPlan(baseInput);
    expect(plan.snapshot.status).toBe('Balanced');
    expect(plan.snapshot.statusColor).toBe('green');
  });

  it('gives higher risk status for overwhelmed input', () => {
    const plan = generateWellnessPlan(highStressInput);
    expect(['Recovery needed', 'Heavy day', 'Watchful', 'Support recommended']).toContain(plan.snapshot.status);
  });

  it('gives crisis status when crisis keywords present', () => {
    const plan = generateWellnessPlan(crisisInput);
    expect(plan.snapshot.status).toBe('Support recommended');
    expect(plan.snapshot.statusColor).toBe('red');
  });
});

describe('generateWellnessPlan — safety support', () => {
  it('sets crisis level for crisis keywords', () => {
    const plan = generateWellnessPlan(crisisInput);
    expect(plan.safetySupport.level).toBe('crisis');
    expect(plan.safetySupport.showCrisisCard).toBe(true);
  });

  it('returns resources in crisis mode', () => {
    const plan = generateWellnessPlan(crisisInput);
    expect(plan.safetySupport.resources.length).toBeGreaterThan(0);
  });

  it('sets elevated for overwhelmed mood', () => {
    const plan = generateWellnessPlan(highStressInput);
    expect(['elevated', 'crisis']).toContain(plan.safetySupport.level);
  });

  it('sets normal for calm input', () => {
    const plan = generateWellnessPlan(baseInput);
    expect(plan.safetySupport.level).toBe('normal');
  });

  it('provides panic-to-plan for elevated', () => {
    const plan = generateWellnessPlan(highStressInput);
    if (plan.safetySupport.level === 'elevated') {
      expect(plan.safetySupport.panicToPlan).not.toBeNull();
    }
  });
});

describe('generateWellnessPlan — reset steps', () => {
  it('returns 3 steps', () => {
    const plan = generateWellnessPlan(baseInput);
    expect(plan.resetSteps).toHaveLength(3);
  });

  it('step 1 is always breathing for high stress', () => {
    const plan = generateWellnessPlan(highStressInput);
    expect(plan.resetSteps[0].category).toBe('breathe');
  });
});

describe('generateWellnessPlan — evidence items', () => {
  it('returns at least 7 evidence items', () => {
    const plan = generateWellnessPlan(baseInput);
    expect(plan.evidenceItems.length).toBeGreaterThanOrEqual(7);
  });

  it('has correct label for stress level', () => {
    const plan = generateWellnessPlan(baseInput);
    const stressItem = plan.evidenceItems.find((e) => e.label === 'Stress level');
    expect(stressItem).toBeDefined();
    expect(stressItem?.value).toBe(`${baseInput.stressLevel}/10`);
  });
});

describe('detectStressLoop', () => {
  it('detects score rumination loop', () => {
    const input: StudentCheckInInput = {
      ...baseInput,
      triggers: ['Mock test score', 'Comparison with friends'],
      confidenceLevel: 3,
    };
    const loop = detectStressLoop(input);
    expect(loop).not.toBeNull();
    expect(loop?.id).toBe('score-rumination');
  });

  it('detects backlog paralysis loop', () => {
    const input: StudentCheckInInput = {
      ...baseInput,
      triggers: ['Syllabus backlog', 'Time management'],
      focusLevel: 4,
    };
    const loop = detectStressLoop(input);
    expect(loop).not.toBeNull();
    expect(loop?.id).toBe('backlog-paralysis');
  });

  it('detects insomnia fatigue loop', () => {
    const input: StudentCheckInInput = {
      ...baseInput,
      sleepQuality: 3,
      energyLevel: 3,
      stressLevel: 8,
    };
    const loop = detectStressLoop(input);
    expect(loop).not.toBeNull();
    expect(loop?.id).toBe('insomnia-fatigue');
  });

  it('detects result limbo loop', () => {
    const input: StudentCheckInInput = {
      ...baseInput,
      examPhase: 'Result Waiting',
      triggers: ['Result uncertainty'],
    };
    const loop = detectStressLoop(input);
    expect(loop?.id).toBe('result-limbo');
  });

  it('returns null for no loop indicators', () => {
    const loop = detectStressLoop(baseInput);
    expect(loop).toBeNull();
  });
});

describe('detectPainPoints', () => {
  it('detects mock hangover', () => {
    const input: StudentCheckInInput = {
      ...baseInput,
      triggers: ['Mock test score'],
      confidenceLevel: 3,
      mood: 'Anxious',
    };
    const points = detectPainPoints(input);
    const ids = points.map((p) => p.id);
    expect(ids).toContain('mock-hangover');
  });

  it('detects insomnia loop pain point', () => {
    const input: StudentCheckInInput = {
      ...baseInput,
      sleepQuality: 3,
      stressLevel: 8,
    };
    const points = detectPainPoints(input);
    const ids = points.map((p) => p.id);
    expect(ids).toContain('insomnia-loop');
  });

  it('detects imposter revision from reflection', () => {
    const input: StudentCheckInInput = {
      ...baseInput,
      triggers: ['Syllabus backlog'],
    };
    const points = detectPainPoints(input);
    const ids = points.map((p) => p.id);
    expect(ids).toContain('imposter-revision');
  });

  it('returns empty for calm baseline', () => {
    const points = detectPainPoints(baseInput);
    expect(points.length).toBe(0);
  });
});

describe('generateWellnessPlan — exam phase protocol', () => {
  const phases: StudentCheckInInput['examPhase'][] = [
    'Regular Prep',
    'Mock Test Week',
    'Final 7 Days',
    'Exam Day',
    'Result Waiting',
  ];

  for (const phase of phases) {
    it(`returns non-empty protocol for ${phase}`, () => {
      const input = { ...baseInput, examPhase: phase };
      const plan = generateWellnessPlan(input);
      expect(plan.examPhaseProtocol.length).toBeGreaterThan(10);
    });
  }
});
