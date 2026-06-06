// PrepBuddy — Application Constants
import type {
  ExamType,
  ExamPhase,
  MoodLabel,
  StressTrigger,
  MascotName,
  SupportResource,
  ResetFeelingLabel,
} from './types';

export const EXAM_TYPES: ExamType[] = [
  'JEE',
  'NEET',
  'CUET',
  'CAT',
  'GATE',
  'UPSC',
  'Board Exams',
  'Other',
];

export const EXAM_PHASES: ExamPhase[] = [
  'Regular Prep',
  'Mock Test Week',
  'Final 7 Days',
  'Exam Day',
  'Result Waiting',
];

export const MOOD_LABELS: MoodLabel[] = [
  'Calm',
  'Okay',
  'Stressed',
  'Anxious',
  'Low',
  'Overwhelmed',
];

export const STRESS_TRIGGERS: StressTrigger[] = [
  'Syllabus backlog',
  'Mock test score',
  'Parental pressure',
  'Comparison with friends',
  'Social media distraction',
  'Sleep loss',
  'Fear of failure',
  'Result uncertainty',
  'Time management',
  'Health issue',
  'Financial pressure',
  'Loneliness',
  'Too many resources',
  'Coaching pressure',
];

export const RESET_FEELINGS: ResetFeelingLabel[] = [
  'Anxious',
  'Defeated',
  'Angry',
  'Numb',
  'Overwhelmed',
];

export const MASCOT_NAMES: MascotName[] = [
  'Resilient Falcon',
  'Calm Tiger',
  'Steady Lotus',
  'Brave Banyan',
  'Focused Comet',
  'Quiet Phoenix',
  'Grounded Whale',
];

export const MASCOT_EMOJI: Record<MascotName, string> = {
  'Resilient Falcon': '🦅',
  'Calm Tiger': '🐯',
  'Steady Lotus': '🪷',
  'Brave Banyan': '🌳',
  'Focused Comet': '☄️',
  'Quiet Phoenix': '🦜',
  'Grounded Whale': '🐋',
};

export const MOOD_EMOJI: Record<MoodLabel, string> = {
  Calm: '😌',
  Okay: '🙂',
  Stressed: '😤',
  Anxious: '😰',
  Low: '😔',
  Overwhelmed: '😵',
};

export const MOOD_COLOR: Record<MoodLabel, string> = {
  Calm: '#34D399',
  Okay: '#2DD4BF',
  Stressed: '#F4A261',
  Anxious: '#F4A261',
  Low: '#F87171',
  Overwhelmed: '#EF4444',
};

export const TRIGGER_EMOJI: Record<StressTrigger, string> = {
  'Syllabus backlog': '📚',
  'Mock test score': '📊',
  'Parental pressure': '👨‍👩‍👦',
  'Comparison with friends': '👥',
  'Social media distraction': '📱',
  'Sleep loss': '😴',
  'Fear of failure': '😨',
  'Result uncertainty': '⏳',
  'Time management': '⏰',
  'Health issue': '🏥',
  'Financial pressure': '💰',
  Loneliness: '🫂',
  'Too many resources': '📖',
  'Coaching pressure': '🎓',
};

export const EXAM_PHASE_PROTOCOLS: Record<ExamPhase, string> = {
  'Regular Prep':
    'Build consistent daily study routines. Small, steady progress beats irregular intense sessions. One chapter done well is better than five chapters skimmed.',
  'Mock Test Week':
    'After each mock, analyse only 3 key mistakes — not the entire paper. A mock score is a compass for what to study next, not a verdict on your future.',
  'Final 7 Days':
    'Prioritise revision of high-confidence topics. Protect your sleep above all else. Avoid starting new heavy chapters in the final week.',
  'Exam Day':
    'Trust your preparation. Eat light, arrive early. If you freeze on the first question, skip it, breathe slowly, and solve one easier question first.',
  'Result Waiting':
    'Uncertainty is normal and it resolves with time. Anchor yourself in a daily routine, connect with supportive people, and limit result-prediction conversations.',
};

export const ALL_SUPPORT_RESOURCES: SupportResource[] = [
  {
    name: 'Tele-MANAS (India Mental Health)',
    contact: '14416 / 1800-891-4416',
    telLink: 'tel:14416',
    note: 'Free 24/7 mental health support. Availability may vary by region.',
  },
  {
    name: 'KIRAN Mental Health Helpline',
    contact: '1800-599-0019',
    telLink: 'tel:18005990019',
    note: 'Free 24/7 mental health support in multiple Indian languages.',
  },
  {
    name: 'CBSE Student Counselling / IVRS',
    contact: '1800-11-8004',
    telLink: 'tel:18001180004',
    note: 'CBSE counselling support is often available during board exam and result periods. Check latest official CBSE updates for availability.',
    showFor: ['Board Exams'],
  },
  {
    name: 'Vandrevala Foundation',
    contact: '+91 9999 666 555',
    telLink: 'tel:+919999666555',
    note: '24/7 mental health support in English and Hindi.',
  },
  {
    name: 'Sneha India',
    contact: '044-24640050',
    telLink: 'tel:04424640050',
    note: 'Emotional support helpline available 8 AM – 10 PM.',
  },
  {
    name: 'Trusted Person',
    contact: 'Parent · Teacher · Friend · School Counsellor · Coaching Mentor',
    note: 'Reaching out to someone you trust is always the safest first step.',
  },
];

// Crisis keywords — server and client side detection
export const CRISIS_KEYWORDS = [
  'kill myself',
  'want to die',
  'end my life',
  'suicide',
  'self harm',
  'self-harm',
  'hurt myself',
  'harm myself',
  'cutting myself',
  'no reason to live',
  'no point in living',
  'cant go on',
  "can't go on",
  'give up on life',
  'worthless',
  'better off dead',
  'disappear forever',
  'sleep forever',
  'never wake up',
  'life is over',
  'cannot live',
  'life over',
  'end it all',
  'not worth living',
  'would be better without me',
];

// "Is this normal?" card content
export const IS_THIS_NORMAL_CARDS = [
  {
    question: 'Why do I feel like I forgot everything?',
    answer:
      'Tired brains often feel blank — it is a temporary state, not a permanent loss. Start with one familiar topic to rebuild recall. The knowledge is still there.',
  },
  {
    question: 'Why did one mock score ruin my mood?',
    answer:
      'Mock scores create a pattern your brain interprets as judgment. One score is data for 3 mistakes to fix — not a verdict on your future. Analyse it, then move on.',
  },
  {
    question: "Why can't I sleep before exams?",
    answer:
      'Pre-exam cortisol is a biological stress response. Light dinner, no screens 30 minutes before bed, and a simple breathing exercise can signal your brain it is safe to rest.',
  },
  {
    question: 'Why do I freeze on the first hard question?',
    answer:
      'Exam freeze is a nervous system response triggered by perceived threat. Skip the hard question, place your feet flat on the floor, take one slow exhale, and solve one easy question first.',
  },
  {
    question: 'Why do I feel guilty while resting?',
    answer:
      'Rest guilt is extremely common among exam students, especially with social comparison. Sleep and breaks are not laziness — they protect your memory and attention span. Rest is part of studying.',
  },
];

// Reset reframe messages by feeling
export const RESET_REFRAMES: Record<ResetFeelingLabel, string[]> = {
  Anxious: [
    'Your mock test score is a compass for what to study next, not a verdict on your future.',
    'Let\'s take a 90-second break. Your books will wait, and your brain will thank you.',
    'One safe next step is enough for now.',
  ],
  Defeated: [
    'One bad mock is data. It is not destiny.',
    'Review 3 mistakes first. That is enough to restart momentum.',
    'It is okay to feel disappointed about today\'s test. That feeling is valid and will pass.',
  ],
  Angry: [
    'It is okay to feel angry or disappointed about today\'s test.',
    'Your frustration is energy. Let\'s redirect one small part of it into one action.',
    'One safe next step is enough for now.',
  ],
  Numb: [
    'Feeling numb after intense stress is normal. Your mind is protecting you.',
    'Let\'s take a 90-second break. Your books will wait, and your brain will thank you.',
    'It is completely normal to feel like you have forgotten things when you are tired.',
  ],
  Overwhelmed: [
    'Let\'s take a 90-second break. Your books will wait, and your brain will thank you.',
    'One safe next step is enough for now.',
    'It is completely normal to feel overwhelmed at this point in your journey.',
  ],
};

export const RESET_NEXT_ACTIONS = [
  'Review only 3 mistakes from your last mock test.',
  'Start one 25-minute known-topic sprint.',
  'Drink water and walk for 5 minutes.',
  'Message one trusted person for calm support.',
];

// LocalStorage keys
export const STORAGE_KEYS = {
  JOURNEY: 'prepbuddy:v1:checkins',
  PROFILE: 'prepbuddy:v1:profile',
  SETTINGS: 'prepbuddy:v1:settings',
};

// Limits
export const MAX_REFLECTION_LENGTH = 1000;
export const MAX_TRIGGERS = 14;
export const MIN_SCALE = 1;
export const MAX_SCALE = 10;
export const MAX_STUDY_HOURS = 16;
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 5;
export const MAX_JOURNEY_ENTRIES = 30;

// Legacy key for migration
export const LEGACY_JOURNEY_KEY = 'preppulse_journey';
