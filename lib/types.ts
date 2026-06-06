// PrepPulse — Core TypeScript Types
// Strict mode: no 'any', no loose typing

export type ExamType =
  | 'JEE'
  | 'NEET'
  | 'CUET'
  | 'CAT'
  | 'GATE'
  | 'UPSC'
  | 'Board Exams'
  | 'Other';

export type ExamPhase =
  | 'Regular Prep'
  | 'Mock Test Week'
  | 'Final 7 Days'
  | 'Exam Day'
  | 'Result Waiting';

export type MoodLabel =
  | 'Calm'
  | 'Okay'
  | 'Stressed'
  | 'Anxious'
  | 'Low'
  | 'Overwhelmed';

export type StressTrigger =
  | 'Syllabus backlog'
  | 'Mock test score'
  | 'Parental pressure'
  | 'Comparison with friends'
  | 'Social media distraction'
  | 'Sleep loss'
  | 'Fear of failure'
  | 'Result uncertainty'
  | 'Time management'
  | 'Health issue'
  | 'Financial pressure'
  | 'Loneliness'
  | 'Too many resources'
  | 'Coaching pressure';

export type WellnessStatus =
  | 'Balanced'
  | 'Watchful'
  | 'Heavy day'
  | 'Recovery needed'
  | 'Support recommended';

export type SupportLevel = 'normal' | 'elevated' | 'crisis';

export interface StudentCheckInInput {
  // Step 1: Exam Context
  examType: ExamType;
  examPhase: ExamPhase;
  studyHoursPlanned: number; // 0–16

  // Step 2: Mind & Body
  mood: MoodLabel;
  stressLevel: number; // 1–10
  anxietyLevel: number; // 1–10
  energyLevel: number; // 1–10
  sleepQuality: number; // 1–10
  focusLevel: number; // 1–10
  confidenceLevel: number; // 1–10

  // Step 3: Triggers
  triggers: StressTrigger[];

  // Step 4: Reflection
  reflection: string; // max 1000 chars after sanitization
}

export interface WellnessSnapshot {
  status: WellnessStatus;
  statusColor: 'green' | 'amber' | 'orange' | 'red';
  mood: MoodLabel;
  stressLevel: number;
  energyLevel: number;
  confidenceLevel: number;
  sleepQuality: number;
  summary: string;
}

export interface TriggerAnalysis {
  topTriggers: StressTrigger[];
  triggerSummary: string;
  actionMap: Record<StressTrigger, string>;
}

export interface ResetStep {
  step: number;
  action: string;
  duration: string;
  category: 'breathe' | 'study' | 'recover' | 'connect';
}

export interface StudyRecoveryPlan {
  intensityRecommendation: string;
  sessionBlocks: string[];
  recoveryAction: string;
  avoidList: string[];
}

export interface CalmExercise {
  name: string;
  description: string;
  steps: string[];
  duration: string;
}

export interface SafetySupport {
  level: SupportLevel;
  message: string;
  showCrisisCard: boolean;
  resources: SupportResource[];
  panicToPlan: PanicToPlan | null;
}

export interface SupportResource {
  name: string;
  contact: string;
  note: string;
}

export interface PanicToPlan {
  breathingStep: string;
  controllableAction: string;
  recoveryAction: string;
  shareableMessage: string;
}

export interface WellnessPlan {
  snapshot: WellnessSnapshot;
  triggerAnalysis: TriggerAnalysis;
  resetSteps: ResetStep[];
  studyRecoveryPlan: StudyRecoveryPlan;
  reflectionInsight: string;
  calmExercise: CalmExercise;
  safetySupport: SafetySupport;
  examPhaseProtocol: string;
  generatedAt: string; // ISO string
}

export interface JourneyEntry {
  id: string;
  date: string; // ISO date string
  checkIn: StudentCheckInInput;
  plan: WellnessPlan;
}

export interface JourneyStats {
  streak: number;
  totalCheckIns: number;
  averageStress: number;
  averageSleep: number;
  averageConfidence: number;
  averageEnergy: number;
  mostCommonTriggers: StressTrigger[];
  moodTrend: Array<{ date: string; mood: MoodLabel; stress: number }>;
  improvementNote: string;
}

export interface ApiRequest {
  checkIn: StudentCheckInInput;
}

export interface ApiResponse {
  success: true;
  plan: WellnessPlan;
}

export interface ApiError {
  success: false;
  error: string;
  code: 'VALIDATION_ERROR' | 'RATE_LIMIT' | 'INTERNAL_ERROR';
}
