// PrepBuddy — Core TypeScript Types

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

export type MascotName =
  | 'Resilient Falcon'
  | 'Calm Tiger'
  | 'Steady Lotus'
  | 'Brave Banyan'
  | 'Focused Comet'
  | 'Quiet Phoenix'
  | 'Grounded Whale';

export type ResetFeelingLabel =
  | 'Anxious'
  | 'Defeated'
  | 'Angry'
  | 'Numb'
  | 'Overwhelmed';

// ─── Stress Loops ───

export type StressLoopId =
  | 'score-rumination'
  | 'backlog-paralysis'
  | 'insomnia-fatigue'
  | 'result-limbo'
  | 'expectation-pressure'
  | 'exam-freeze';

export interface DetectedStressLoop {
  id: StressLoopId;
  name: string;
  chain: string;
  action: string;
}

// ─── Hidden Pain Points ───

export type PainPointId =
  | 'mock-hangover'
  | 'silent-guilt'
  | 'insomnia-loop'
  | 'peer-isolation'
  | 'result-limbo'
  | 'imposter-revision'
  | 'somatic-stress'
  | 'rank-self-worth'
  | 'toxic-hustle'
  | 'exam-freeze';

export interface DetectedPainPoint {
  id: PainPointId;
  message: string;
  action: string;
}

// ─── Check-In Input ───

export interface StudentCheckInInput {
  examType: ExamType;
  examPhase: ExamPhase;
  studyHoursPlanned: number;
  mood: MoodLabel;
  stressLevel: number;
  anxietyLevel: number;
  energyLevel: number;
  sleepQuality: number;
  focusLevel: number;
  confidenceLevel: number;
  triggers: StressTrigger[];
  reflection: string;
}

// ─── Wellness Plan ───

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

export interface SupportResource {
  name: string;
  contact: string;
  telLink?: string;
  note: string;
  showFor?: ExamType[];
}

export interface SafetySupport {
  level: SupportLevel;
  message: string;
  showCrisisCard: boolean;
  resources: SupportResource[];
  panicToPlan: PanicToPlan | null;
}

export interface PanicToPlan {
  breathingStep: string;
  controllableAction: string;
  recoveryAction: string;
  shareableMessage: string;
}

export interface EvidenceItem {
  label: string;
  value: string | number;
  signal: 'high' | 'medium' | 'low' | 'neutral';
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
  detectedStressLoop: DetectedStressLoop | null;
  detectedPainPoints: DetectedPainPoint[];
  evidenceItems: EvidenceItem[];
  generatedAt: string;
}

// ─── Journey ───

export interface JourneyEntry {
  id: string;
  date: string;
  checkIn: StudentCheckInInput;
  plan: WellnessPlan;
  mascotName?: MascotName;
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

export interface MentorSummary {
  averageStress: number;
  averageSleep: number;
  averageConfidence: number;
  topTriggers: StressTrigger[];
  recentReflectionSummary: string;
  recurringLoop: string;
  suggestedSupport: string;
}

// ─── API ───

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

// ─── Profile ───

export interface StudentProfile {
  mascotName: MascotName;
  examType: ExamType;
  createdAt: string;
}
