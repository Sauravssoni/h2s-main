// PrepBuddy — Wellness Engine
// Deterministic plan generator — works without AI.

import type {
  StudentCheckInInput,
  WellnessPlan,
  WellnessSnapshot,
  WellnessStatus,
  TriggerAnalysis,
  ResetStep,
  StudyRecoveryPlan,
  CalmExercise,
  SafetySupport,
  PanicToPlan,
  SupportResource,
  DetectedStressLoop,
  DetectedPainPoint,
  EvidenceItem,
} from './types';
import {
  EXAM_PHASE_PROTOCOLS,
  ALL_SUPPORT_RESOURCES,
} from './constants';
import {
  detectCrisisKeywords,
  getSupportLevel,
  detectSomaticSignals,
  detectGuiltSignals,
  detectIsolationSignals,
  detectToxicHustle,
  detectImposterRevision,
  detectRankSelfWorth,
  detectExamFreeze,
} from './risk';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function includes(triggers: string[], trigger: string): boolean {
  return triggers.includes(trigger);
}

// 

// ─── Snapshot ────────────────────────────────────────────────────────────────

function computeSnapshot(input: StudentCheckInInput): WellnessSnapshot {
  const { stressLevel, energyLevel, sleepQuality, confidenceLevel, mood } = input;

  // Composite wellness score (higher = more at risk)
  const riskScore =
    stressLevel * 0.35 +
    (10 - energyLevel) * 0.2 +
    (10 - sleepQuality) * 0.2 +
    (10 - confidenceLevel) * 0.15 +
    (mood === 'Overwhelmed' ? 2 : mood === 'Low' ? 1.5 : mood === 'Anxious' ? 1 : 0);

  let status: WellnessStatus;
  let statusColor: WellnessSnapshot['statusColor'];
  let summary: string;

  if (detectCrisisKeywords(input.reflection)) {
    status = 'Support recommended';
    statusColor = 'red';
    summary = 'We noticed some concerning signals in your reflection. Please see the support resources below.';
  } else if (riskScore >= 9) {
    status = 'Recovery needed';
    statusColor = 'red';
    summary = 'Your signals suggest you need a recovery day today. A lighter plan and early sleep are the priority.';
  } else if (riskScore >= 7) {
    status = 'Heavy day';
    statusColor = 'orange';
    summary = 'Today feels heavy. Let\'s build a reduced-intensity plan with one clear next action.';
  } else if (riskScore >= 5) {
    status = 'Watchful';
    statusColor = 'amber';
    summary = 'A few stress signals are present. A steady, manageable plan will help you finish the day well.';
  } else {
    status = 'Balanced';
    statusColor = 'green';
    summary = 'Your check-in looks reasonably balanced. Keep the momentum going with a focused session.';
  }

  return {
    status,
    statusColor,
    mood,
    stressLevel,
    energyLevel,
    confidenceLevel,
    sleepQuality,
    summary,
  };
}

// ─── Trigger Analysis ─────────────────────────────────────────────────────────

const TRIGGER_ACTIONS: Record<string, string> = {
  'Syllabus backlog':
    'Pick ONE priority topic. Set a 25-minute timer. Do not open any other chapter until the timer ends.',
  'Mock test score':
    'Open your last mock paper. Write down exactly 3 mistakes. Analyse only those 3 — nothing else today.',
  'Parental pressure':
    'Use the copyable support message in the Panic-to-Plan section to communicate your needs calmly.',
  'Comparison with friends':
    'Mute or unfollow rank/score discussions for 48 hours. Your syllabus, your pace.',
  'Social media distraction':
    'Set a 20-minute phone-free study block. Place your phone face-down in another room.',
  'Sleep loss':
    'Tonight: stop study by 10 PM. Use the box-breathing exercise before sleep.',
  'Fear of failure':
    'Write one identity statement that has nothing to do with marks or rank.',
  'Result uncertainty':
    'Set one result-check window per day. Outside that window, engage in a routine activity.',
  'Time management':
    'List the three most important tasks for today. Complete only those.',
  'Health issue':
    'Your body takes priority. Rest today. Even 60 minutes of rest is more useful than 6 hours of forced study.',
  'Financial pressure':
    'Carrying financial pressure silently is exhausting. Try the support message to share this burden with someone you trust.',
  Loneliness:
    'Send one low-pressure check-in message to a safe person — no need to explain everything.',
  'Too many resources':
    'Choose one source for one topic today and ignore the rest. Consistency beats variety.',
  'Coaching pressure':
    'Separate your own preparation goals from external ranking pressure. Your pace is valid.',
};

function computeTriggerAnalysis(input: StudentCheckInInput): TriggerAnalysis {
  const topTriggers = input.triggers.slice(0, 3);
  const actionMap: Record<string, string> = {};

  for (const trigger of input.triggers) {
    actionMap[trigger] =
      TRIGGER_ACTIONS[trigger] ??
      'Acknowledge this trigger. Take one small controllable action.';
  }

  const triggerSummary =
    topTriggers.length === 0
      ? 'No specific triggers selected today.'
      : `Your top pressure points today: ${topTriggers.join(', ')}.`;

  return { topTriggers, triggerSummary, actionMap };
}

// ─── Stress Loop Detector ─────────────────────────────────────────────────────

export function detectStressLoop(input: StudentCheckInInput): DetectedStressLoop | null {
  const { triggers, examPhase, stressLevel, confidenceLevel, sleepQuality, energyLevel, focusLevel, mood, reflection } = input;

  // A. Score Rumination Loop
  if (
    includes(triggers, 'Mock test score') &&
    includes(triggers, 'Comparison with friends') &&
    confidenceLevel <= 4
  ) {
    return {
      id: 'score-rumination',
      name: 'Score Rumination Loop',
      chain: 'Mock score → comparison → low confidence.',
      action: 'Review only 3 mistakes. Do not judge your future from one paper.',
    };
  }

  // B. Backlog Paralysis Loop
  if (
    includes(triggers, 'Syllabus backlog') &&
    includes(triggers, 'Time management') &&
    focusLevel <= 5
  ) {
    return {
      id: 'backlog-paralysis',
      name: 'Backlog Paralysis Loop',
      chain: 'Backlog → panic → low focus → more backlog.',
      action: 'Pick one priority topic and do a 25-minute sprint.',
    };
  }

  // C. Insomnia-Fatigue Loop
  if (sleepQuality <= 4 && energyLevel <= 4 && stressLevel >= 7) {
    return {
      id: 'insomnia-fatigue',
      name: 'Insomnia-Fatigue Loop',
      chain: 'Poor sleep → poor focus → incomplete targets → more anxiety.',
      action: 'Use a lighter plan today and protect tonight\'s sleep.',
    };
  }

  // D. Result Limbo Loop
  if (examPhase === 'Result Waiting' && includes(triggers, 'Result uncertainty')) {
    return {
      id: 'result-limbo',
      name: 'Result Limbo Loop',
      chain: 'Uncertainty → checking → more anxiety.',
      action: 'Set one result-checking window. Do not refresh forums all day.',
    };
  }

  // E. Expectation Pressure Loop
  if (
    includes(triggers, 'Parental pressure') &&
    (includes(triggers, 'Fear of failure') || detectGuiltSignals(reflection))
  ) {
    return {
      id: 'expectation-pressure',
      name: 'Expectation Pressure Loop',
      chain: 'Expectation → guilt → fear → shutdown.',
      action: 'Use the support note to ask for calm, not pressure.',
    };
  }

  // F. Exam Freeze Loop
  if (
    examPhase === 'Exam Day' &&
    (mood === 'Anxious' || mood === 'Overwhelmed') &&
    (detectExamFreeze(reflection) || includes(triggers, 'Fear of failure'))
  ) {
    return {
      id: 'exam-freeze',
      name: 'Exam Freeze Loop',
      chain: 'Hard first question → panic → blanking → avoidable mistakes.',
      action: 'Skip, breathe, solve one easy question first.',
    };
  }

  return null;
}

// ─── Pain Point Detector ──────────────────────────────────────────────────────

export function detectPainPoints(input: StudentCheckInInput): DetectedPainPoint[] {
  const { triggers, examPhase, stressLevel, energyLevel, sleepQuality, confidenceLevel, mood, reflection } = input;
  const points: DetectedPainPoint[] = [];

  // 1. Mock Hangover
  if (
    includes(triggers, 'Mock test score') &&
    (confidenceLevel <= 4 || ['Anxious', 'Overwhelmed', 'Low'].includes(mood))
  ) {
    points.push({
      id: 'mock-hangover',
      message: 'Your mock score may have triggered a mock hangover. A mock test is a compass, not a verdict.',
      action: 'Review only 3 mistakes today. Do not restart the entire syllabus.',
    });
  }

  // 2. Silent Guilt
  if (includes(triggers, 'Parental pressure') || detectGuiltSignals(reflection)) {
    points.push({
      id: 'silent-guilt',
      message:
        'You may be carrying pressure about your family\'s sacrifice. That is heavy, but your worth is not a financial transaction.',
      action: 'Use a calm support note instead of carrying it silently.',
    });
  }

  // 3. Insomnia-Fatigue Loop
  if (sleepQuality <= 4 && (stressLevel >= 7 || energyLevel <= 4)) {
    points.push({
      id: 'insomnia-loop',
      message: 'Poor sleep is making study feel harder, which can increase stress again.',
      action: 'Use a lighter study block today and protect tonight\'s sleep.',
    });
  }

  // 4. Peer Isolation
  if (
    includes(triggers, 'Loneliness') ||
    includes(triggers, 'Comparison with friends') ||
    detectIsolationSignals(reflection)
  ) {
    points.push({
      id: 'peer-isolation',
      message: 'Isolation can make exam stress feel louder.',
      action: 'Send one low-pressure message to a safe person.',
    });
  }

  // 5. Result Limbo
  if (examPhase === 'Result Waiting' || includes(triggers, 'Result uncertainty')) {
    points.push({
      id: 'result-limbo',
      message: 'Your stress seems tied to result limbo and uncertainty.',
      action: 'Set one result-checking window. Do not refresh forums all day.',
    });
  }

  // 6. Imposter Revision Syndrome
  if (includes(triggers, 'Syllabus backlog') || detectImposterRevision(reflection)) {
    points.push({
      id: 'imposter-revision',
      message:
        'Feeling like you forgot everything is common when tired. It does not mean the work is gone.',
      action: 'Revise one familiar topic first to rebuild recall.',
    });
  }

  // 7. Somatic Stress Signal
  if (detectSomaticSignals(reflection)) {
    points.push({
      id: 'somatic-stress',
      message:
        'Your body may be showing stress signals. Pause and ground before forcing more study.',
      action:
        'Start the 90-second reset. If symptoms continue, speak to a trusted adult or professional support.',
    });
  }

  // 8. Rank-Based Self-Worth
  if (detectRankSelfWorth(reflection)) {
    points.push({
      id: 'rank-self-worth',
      message:
        'Your rank is feedback about one exam path. It is not a verdict on your value as a person.',
      action: 'Write one identity statement unrelated to marks.',
    });
  }

  // 9. Toxic Hustle Pressure
  if (detectToxicHustle(reflection)) {
    points.push({
      id: 'toxic-hustle',
      message: 'Rest is not laziness. Sleep protects memory and attention.',
      action:
        'Replace one exhausted study block with a shorter focused sprint and a real break.',
    });
  }

  // 10. Exam-Day Freeze
  if (examPhase === 'Exam Day' || detectExamFreeze(reflection)) {
    points.push({
      id: 'exam-freeze',
      message:
        'Exam freeze is a nervous-system response, not proof that you are unprepared.',
      action:
        'Feet on floor, slow exhale, skip the first hard question, solve one easy question.',
    });
  }

  return points;
}

// ─── Evidence Items ───────────────────────────────────────────────────────────

function buildEvidenceItems(input: StudentCheckInInput): EvidenceItem[] {
  const items: EvidenceItem[] = [
    {
      label: 'Stress level',
      value: `${input.stressLevel}/10`,
      signal: input.stressLevel >= 8 ? 'high' : input.stressLevel >= 6 ? 'medium' : 'low',
    },
    {
      label: 'Anxiety level',
      value: `${input.anxietyLevel}/10`,
      signal: input.anxietyLevel >= 8 ? 'high' : input.anxietyLevel >= 6 ? 'medium' : 'low',
    },
    {
      label: 'Sleep quality',
      value: `${input.sleepQuality}/10`,
      signal: input.sleepQuality <= 4 ? 'high' : input.sleepQuality <= 6 ? 'medium' : 'low',
    },
    {
      label: 'Confidence',
      value: `${input.confidenceLevel}/10`,
      signal: input.confidenceLevel <= 3 ? 'high' : input.confidenceLevel <= 5 ? 'medium' : 'low',
    },
    {
      label: 'Energy',
      value: `${input.energyLevel}/10`,
      signal: input.energyLevel <= 3 ? 'high' : input.energyLevel <= 5 ? 'medium' : 'low',
    },
    {
      label: 'Exam phase',
      value: input.examPhase,
      signal: input.examPhase === 'Exam Day' || input.examPhase === 'Final 7 Days' ? 'high' : 'neutral',
    },
    {
      label: 'Selected triggers',
      value: input.triggers.length > 0 ? input.triggers.slice(0, 3).join(', ') : 'None',
      signal: input.triggers.length >= 4 ? 'high' : input.triggers.length >= 2 ? 'medium' : 'low',
    },
  ];

  if (input.reflection && input.reflection.length > 10) {
    items.push({
      label: 'Reflection signals',
      value: detectCrisisKeywords(input.reflection)
        ? 'Crisis keywords detected'
        : detectSomaticSignals(input.reflection)
          ? 'Somatic signals detected'
          : 'None detected',
      signal: detectCrisisKeywords(input.reflection) ? 'high' : detectSomaticSignals(input.reflection) ? 'medium' : 'neutral',
    });
  }

  return items;
}

// ─── Reset Steps ─────────────────────────────────────────────────────────────

function buildResetSteps(input: StudentCheckInInput): ResetStep[] {
  const { stressLevel, sleepQuality, confidenceLevel, energyLevel, triggers } = input;

  const steps: ResetStep[] = [];

  // Step 1: Always breathing/grounding
  if (stressLevel >= 8 || input.mood === 'Overwhelmed') {
    steps.push({
      step: 1,
      action: 'Box breathing: Inhale 4 — Hold 4 — Exhale 4 — Hold 4. Repeat 3 times.',
      duration: '2 min',
      category: 'breathe',
    });
  } else {
    steps.push({
      step: 1,
      action: 'Take 3 slow, deep breaths. Place your feet flat on the floor.',
      duration: '1 min',
      category: 'breathe',
    });
  }

  // Step 2: Study action (context-specific)
  if (includes(triggers, 'Mock test score')) {
    steps.push({
      step: 2,
      action: 'Open your mock paper and write down exactly 3 mistakes — nothing else.',
      duration: '20 min',
      category: 'study',
    });
  } else if (includes(triggers, 'Syllabus backlog')) {
    steps.push({
      step: 2,
      action: 'Pick one familiar topic. Set a 25-minute timer. Start from page 1 of that topic only.',
      duration: '25 min',
      category: 'study',
    });
  } else if (confidenceLevel <= 3) {
    steps.push({
      step: 2,
      action: 'Revise one topic you already know well. Rebuild your recall before tackling new material.',
      duration: '20 min',
      category: 'study',
    });
  } else {
    steps.push({
      step: 2,
      action: 'Choose your single highest-priority task for today and work on it for 25 minutes.',
      duration: '25 min',
      category: 'study',
    });
  }

  // Step 3: Recovery action
  if (sleepQuality <= 4 || energyLevel <= 3) {
    steps.push({
      step: 3,
      action: 'Rest is part of your plan today. Take a 20-minute break before the next block.',
      duration: '20 min',
      category: 'recover',
    });
  } else if (includes(triggers, 'Loneliness')) {
    steps.push({
      step: 3,
      action: 'Send one low-pressure message to a safe person. You do not have to explain everything.',
      duration: '5 min',
      category: 'connect',
    });
  } else {
    steps.push({
      step: 3,
      action: 'Drink a glass of water. Step outside for 5 minutes. Return to your desk with one clear next task.',
      duration: '5 min',
      category: 'recover',
    });
  }

  return steps;
}

// ─── Study + Recovery Plan ────────────────────────────────────────────────────

function buildStudyPlan(input: StudentCheckInInput): StudyRecoveryPlan {
  const { sleepQuality, energyLevel, stressLevel, examPhase, studyHoursPlanned } = input;

  let intensityRecommendation: string;
  let sessionBlocks: string[];
  let avoidList: string[] = [];
  let recoveryAction: string;

  const lowSleep = sleepQuality <= 4;
  const lowEnergy = energyLevel <= 4;
  const highStress = stressLevel >= 8;

  if (lowSleep && lowEnergy) {
    intensityRecommendation =
      'Lower intensity today — sleep and energy are both low. A lighter plan now protects tomorrow\'s performance.';
    sessionBlocks = [
      '25-minute known-topic revision',
      '10-minute break',
      '25-minute formula/concept review',
      'Rest before 10 PM tonight',
    ];
    avoidList = ['Starting new heavy chapters', 'Late night study', 'Mock tests today'];
    recoveryAction = 'Protect tonight\'s sleep above everything. Stop studying by 10 PM.';
  } else if (highStress || examPhase === 'Exam Day') {
    intensityRecommendation =
      'Moderate intensity — focus on calm, targeted revision rather than high-volume coverage.';
    sessionBlocks = [
      '30-minute targeted revision (priority topic)',
      '10-minute screen break',
      '30-minute practice problems (familiar difficulty)',
      '10-minute walk',
    ];
    avoidList = ['Comparing your progress with others', 'Opening new topics 24 hours before the exam'];
    recoveryAction = 'Finish study by 9:30 PM. Light meal. Box breathing before sleep.';
  } else {
    const adjustedHours = Math.min(studyHoursPlanned, 8);
    intensityRecommendation =
      `Normal intensity with planned ${adjustedHours}-hour target. Pomodoro blocks (25+5) are recommended.`;
    sessionBlocks = [
      '25-minute focused work block (Priority topic 1)',
      '5-minute break',
      '25-minute focused work block (Priority topic 2)',
      '15-minute break (away from screen)',
      '25-minute revision block',
    ];
    avoidList = ['Passive reading without recall testing', 'Skipping meals to study more'];
    recoveryAction = 'Include at least one 15-minute break every 2 hours.';
  }

  return { intensityRecommendation, sessionBlocks, recoveryAction, avoidList };
}

// ─── Calm Exercise ────────────────────────────────────────────────────────────

function buildCalmExercise(input: StudentCheckInInput): CalmExercise {
  const { stressLevel, mood } = input;

  if (stressLevel >= 8 || mood === 'Overwhelmed') {
    return {
      name: 'Box Breathing',
      description: 'A 90-second breathing technique used by athletes and high-stress professionals.',
      steps: [
        'Inhale slowly for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly for 4 counts',
        'Hold for 4 counts',
        'Repeat 3 times',
      ],
      duration: '90 seconds',
    };
  }

  return {
    name: 'Name the Controllable',
    description: 'Ground your attention in what you can control right now.',
    steps: [
      'Take one slow breath',
      'Name ONE thing you can control in the next 30 minutes',
      'Name ONE thing about today that went okay',
      'Write down your one next action',
    ],
    duration: '2 minutes',
  };
}

// ─── Safety Support ───────────────────────────────────────────────────────────

function buildSafetySupport(input: StudentCheckInInput): SafetySupport {
  const level = getSupportLevel(input.stressLevel, input.anxietyLevel, input.mood, input.reflection);
  const isCrisis = detectCrisisKeywords(input.reflection);

  const resources: SupportResource[] = ALL_SUPPORT_RESOURCES.filter((r) =>
    !r.showFor || r.showFor.includes(input.examType),
  );

  const panicToPlan: PanicToPlan | null =
    level !== 'normal'
      ? {
          breathingStep: 'Inhale 4 counts — Hold 4 — Exhale 4 — Hold 4. Repeat 3 times.',
          controllableAction: 'Write down one topic you can revise in the next 20 minutes.',
          recoveryAction: 'Drink water. Step outside for 5 minutes. Return to one task only.',
          shareableMessage:
            "I'm having a heavy exam-stress day. I don't need pressure right now; I need calm support and a check-in later.",
        }
      : null;

  if (isCrisis || level === 'crisis') {
    return {
      level: 'crisis',
      message:
        'We noticed some concerning signals. Your wellbeing is the most important thing right now. Please reach out to a trusted person or one of the support resources below.',
      showCrisisCard: true,
      resources,
      panicToPlan,
    };
  }

  if (level === 'elevated') {
    return {
      level: 'elevated',
      message:
        'Today feels heavy. The plan above is designed to be manageable. If you need to talk, reach out to a trusted person.',
      showCrisisCard: false,
      resources: resources.slice(0, 3),
      panicToPlan,
    };
  }

  return {
    level: 'normal',
    message:
      'You\'re managing well. Support resources are always here if you need them.',
    showCrisisCard: false,
    resources: resources.slice(0, 2),
    panicToPlan: null,
  };
}

// ─── Reflection Insight ───────────────────────────────────────────────────────

function buildReflectionInsight(input: StudentCheckInInput): string {
  const { reflection, mood, stressLevel, triggers } = input;

  if (!reflection || reflection.trim().length < 5) {
    return `Today\'s check-in shows ${mood.toLowerCase()} mood with stress at ${stressLevel}/10. Taking one controllable action is the safest next step.`;
  }

  if (detectSomaticSignals(reflection)) {
    return 'Your reflection mentions physical signals — chest tightness, headache, or breathlessness can be the body\'s response to stress. Pause and ground before forcing more study.';
  }

  if (detectRankSelfWorth(reflection)) {
    return 'It sounds like exam outcomes feel tied to your sense of worth. Your value as a person is not determined by a rank or a score.';
  }

  if (detectImposterRevision(reflection)) {
    return 'Feeling like you\'ve forgotten everything is extremely common when tired. The knowledge is still there — it just needs a familiar starting point to resurface.';
  }

  if (includes(triggers, 'Parental pressure') || detectGuiltSignals(reflection)) {
    return 'Carrying family pressure silently can become very heavy. It is okay to ask for calm support rather than more pressure.';
  }

  return `Your reflection suggests ${mood.toLowerCase()} feelings today${triggers.length > 0 ? `, with ${triggers[0]} as a key trigger` : ''}. It is okay to feel this way at this point in your journey. One safe next step is enough.`;
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generateWellnessPlan(input: StudentCheckInInput): WellnessPlan {
  const snapshot = computeSnapshot(input);
  const triggerAnalysis = computeTriggerAnalysis(input);
  const resetSteps = buildResetSteps(input);
  const studyRecoveryPlan = buildStudyPlan(input);
  const reflectionInsight = buildReflectionInsight(input);
  const calmExercise = buildCalmExercise(input);
  const safetySupport = buildSafetySupport(input);
  const examPhaseProtocol = EXAM_PHASE_PROTOCOLS[input.examPhase];
  const detectedStressLoop = detectStressLoop(input);
  const detectedPainPoints = detectPainPoints(input);
  const evidenceItems = buildEvidenceItems(input);

  return {
    snapshot,
    triggerAnalysis,
    resetSteps,
    studyRecoveryPlan,
    reflectionInsight,
    calmExercise,
    safetySupport,
    examPhaseProtocol,
    detectedStressLoop,
    detectedPainPoints,
    evidenceItems,
    generatedAt: new Date().toISOString(),
  };
}
