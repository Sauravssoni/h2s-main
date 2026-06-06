// PrepBuddy — Risk Detection (client-safe + server-safe)

import { CRISIS_KEYWORDS } from './constants';

/**
 * Normalize text for risk detection:
 * - lowercase
 * - trim
 * - collapse multiple spaces/punctuation
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?'"]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Check if a given reflection text contains crisis/self-harm keywords.
 * Returns true if any phrase is detected.
 */
export function detectCrisisKeywords(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const normalized = normalize(text);
  return CRISIS_KEYWORDS.some((phrase) => normalized.includes(normalize(phrase)));
}

/**
 * Detect elevated (non-crisis) risk based on quantitative signals.
 */
export function detectElevatedRisk(
  stress: number,
  anxiety: number,
  sleep: number,
  reflection: string,
): boolean {
  if (detectCrisisKeywords(reflection)) return true;
  if (stress >= 9 && anxiety >= 9) return true;
  if (stress >= 8 && sleep <= 3) return true;
  return false;
}

/**
 * Determine the overall support level.
 * "crisis" → crisis keywords or extreme indicators.
 * "elevated" → high stress, low mood, overwhelm signals.
 * "normal" → standard plan.
 */
export type SupportLevelResult = 'crisis' | 'elevated' | 'normal';

export function getSupportLevel(
  stress: number,
  anxiety: number,
  mood: string,
  reflection: string,
): SupportLevelResult {
  if (detectCrisisKeywords(reflection)) return 'crisis';

  const elevatedMoods = ['Overwhelmed', 'Low'];
  if (stress >= 9 && anxiety >= 9) return 'crisis';
  if (elevatedMoods.includes(mood)) return 'elevated';
  if (stress >= 7 || anxiety >= 7) return 'elevated';

  return 'normal';
}

/**
 * Detect somatic (physical) stress signals in reflection text.
 */
const SOMATIC_PHRASES = [
  'chest tight',
  'chest pain',
  'headache',
  'shaking',
  'breathless',
  'cant breathe',
  "can't breathe",
  'hyperventilat',
  'stomach pain',
  'nausea',
  'panic attack',
  'heart racing',
  'dizzy',
];

export function detectSomaticSignals(reflection: string): boolean {
  if (!reflection) return false;
  const normalized = normalize(reflection);
  return SOMATIC_PHRASES.some((phrase) => normalized.includes(phrase));
}

/**
 * Detect financial/parental guilt signals in reflection.
 */
const GUILT_PHRASES = [
  'money',
  'fees',
  'loan',
  'sacrifice',
  'waste',
  'spent on',
  'coaching fees',
];

export function detectGuiltSignals(reflection: string): boolean {
  if (!reflection) return false;
  const normalized = normalize(reflection);
  return GUILT_PHRASES.some((phrase) => normalized.includes(phrase));
}

/**
 * Detect isolation signals.
 */
const ISOLATION_PHRASES = ['alone', 'isolated', 'no friends', 'nobody', 'lonely'];

export function detectIsolationSignals(reflection: string): boolean {
  if (!reflection) return false;
  const normalized = normalize(reflection);
  return ISOLATION_PHRASES.some((phrase) => normalized.includes(phrase));
}

/**
 * Detect toxic hustle signals.
 */
const TOXIC_HUSTLE_PHRASES = [
  '16 hours',
  'sleep less',
  '4 hours',
  'no break',
  'guilty resting',
  'guilty for resting',
  'guilty when resting',
  'rest is waste',
];

export function detectToxicHustle(reflection: string): boolean {
  if (!reflection) return false;
  const normalized = normalize(reflection);
  return TOXIC_HUSTLE_PHRASES.some((phrase) => normalized.includes(phrase));
}

/**
 * Detect imposter/revision syndrome signals.
 */
const IMPOSTER_PHRASES = [
  'forgot everything',
  'forgot all',
  'remember nothing',
  'feels blank',
  'mind is blank',
  'restart syllabus',
  'nothing sticks',
  'cannot recall',
];

export function detectImposterRevision(reflection: string): boolean {
  if (!reflection) return false;
  const normalized = normalize(reflection);
  return IMPOSTER_PHRASES.some((phrase) => normalized.includes(phrase));
}

/**
 * Detect rank-based self-worth signals.
 */
const RANK_WORTH_PHRASES = [
  'rank',
  'useless',
  'failure',
  'life over',
  'no future',
  'worthless',
  'not worth',
];

export function detectRankSelfWorth(reflection: string): boolean {
  if (!reflection) return false;
  const normalized = normalize(reflection);
  return RANK_WORTH_PHRASES.some((phrase) => normalized.includes(phrase));
}

/**
 * Detect exam-day freeze signals.
 */
const FREEZE_PHRASES = [
  'froze',
  'blanked out',
  'went blank',
  'first question',
  'panic in exam',
  'could not write',
  'forgot everything in exam',
];

export function detectExamFreeze(reflection: string): boolean {
  if (!reflection) return false;
  const normalized = normalize(reflection);
  return FREEZE_PHRASES.some((phrase) => normalized.includes(phrase));
}
