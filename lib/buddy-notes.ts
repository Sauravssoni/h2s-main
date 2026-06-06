// PrepBuddy — Buddy Notes Generator
// Contextual, exam-specific affirmations based on triggers, loops, and timeline.

import type { StudentCheckInInput, WellnessPlan, ExamTimeline, BuddyNote } from './types';
import { detectCrisisKeywords } from './risk';

interface NoteCandidate {
  text: string;
  reason: string;
  condition: boolean;
}

/** Generate 3–5 contextual buddy notes based on the student's current state. */
export function generateBuddyNotes(
  input: StudentCheckInInput,
  plan: WellnessPlan,
  timeline: ExamTimeline | null,
): BuddyNote[] {
  // Crisis mode: only safety-focused notes, no productivity affirmations
  if (detectCrisisKeywords(input.reflection) || plan.safetySupport.level === 'crisis') {
    return [
      { id: 'crisis-1', text: 'You are not alone. Reaching out is strength, not weakness.', reason: 'crisis-safety' },
      { id: 'crisis-2', text: 'This feeling is temporary. A trusted person can help right now.', reason: 'crisis-safety' },
      { id: 'crisis-3', text: 'Your safety matters more than any exam.', reason: 'crisis-safety' },
    ];
  }

  const candidates: NoteCandidate[] = [
    // Mock score triggers
    {
      text: 'A mock score is a compass, not a verdict.',
      reason: 'mock-score-trigger',
      condition: input.triggers.includes('Mock test score'),
    },
    {
      text: 'Today is not for restarting the syllabus. Today is for 3 mistakes.',
      reason: 'mock-score-focus',
      condition: input.triggers.includes('Mock test score') && input.confidenceLevel <= 4,
    },

    // Syllabus backlog
    {
      text: 'One topic done well beats ten topics skimmed.',
      reason: 'backlog-trigger',
      condition: input.triggers.includes('Syllabus backlog'),
    },

    // Sleep
    {
      text: 'Your brain remembers better after rest. Sleep is part of revision.',
      reason: 'sleep-quality',
      condition: input.sleepQuality <= 4,
    },

    // Comparison
    {
      text: 'Comparison steals working memory. Come back to your own paper.',
      reason: 'comparison-trigger',
      condition: input.triggers.includes('Comparison with friends'),
    },

    // Parental pressure
    {
      text: 'Their worry comes from love. A calm message can reset the dynamic.',
      reason: 'parental-pressure',
      condition: input.triggers.includes('Parental pressure'),
    },

    // General high stress
    {
      text: 'You do not need a perfect day. You need one safe next step.',
      reason: 'high-stress',
      condition: input.stressLevel >= 7,
    },

    // Low confidence
    {
      text: 'Revision feels empty when tired. The knowledge is still there.',
      reason: 'low-confidence',
      condition: input.confidenceLevel <= 3,
    },

    // Low energy
    {
      text: 'A 20-minute rest now saves 2 hours of staring later.',
      reason: 'low-energy',
      condition: input.energyLevel <= 3,
    },

    // Timeline-aware
    {
      text: 'Pace needs focus, not panic.',
      reason: 'timeline-pace',
      condition: timeline !== null && timeline.paceMode === 'Recovery First',
    },
    {
      text: 'You have time. Build strong foundations, not speed records.',
      reason: 'timeline-runway',
      condition: timeline !== null && timeline.timelinePhase === 'Long Runway',
    },
    {
      text: 'Narrow your targets. Depth beats breadth in the final stretch.',
      reason: 'timeline-sprint',
      condition: timeline !== null && (timeline.timelinePhase === 'Final Sprint' || timeline.timelinePhase === 'Exam Window'),
    },

    // Stress loop awareness
    {
      text: 'You spotted the loop. That awareness is already a step forward.',
      reason: 'stress-loop-detected',
      condition: plan.detectedStressLoop !== null,
    },

    // General fallback (always true, low priority — added last)
    {
      text: 'Showing up for a check-in is already taking care of yourself.',
      reason: 'general-encouragement',
      condition: true,
    },
  ];

  const selected = candidates
    .filter((c) => c.condition)
    .slice(0, 5);

  // Ensure at least 3 notes
  while (selected.length < 3) {
    selected.push({
      text: 'One step at a time. You are doing better than you think.',
      reason: 'fallback',
      condition: true,
    });
  }

  return selected.map((c, i) => ({
    id: `note-${i}`,
    text: c.text,
    reason: c.reason,
  }));
}
