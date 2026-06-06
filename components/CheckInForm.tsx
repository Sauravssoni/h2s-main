'use client';

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StudentCheckInInput, ExamType, ExamPhase, MoodLabel, StressTrigger } from '@/lib/types';
import {
  EXAM_TYPES,
  EXAM_PHASES,
  MOOD_LABELS,
  STRESS_TRIGGERS,
  MOOD_EMOJI,
  TRIGGER_EMOJI,
} from '@/lib/constants';
import Stepper from './Stepper';
import SliderField from './SliderField';
import ChipGroup from './ChipGroup';

const STEP_LABELS = ['Exam Context', 'Mind & Body', 'Triggers', 'Reflect'];

interface CheckInFormProps {
  initialValues?: Partial<StudentCheckInInput>;
  onSubmit: (data: StudentCheckInInput) => void;
  isLoading: boolean;
}

export default function CheckInForm({
  initialValues,
  onSubmit,
  isLoading,
}: CheckInFormProps) {
  const [step, setStep] = useState(1);
  const [examType, setExamType] = useState<ExamType | ''>(initialValues?.examType ?? '');
  const [examPhase, setExamPhase] = useState<ExamPhase | ''>(initialValues?.examPhase ?? '');
  const [studyHours, setStudyHours] = useState<number | ''>(initialValues?.studyHoursPlanned ?? '');
  const [mood, setMood] = useState<MoodLabel | ''>(initialValues?.mood ?? '');
  const [stressLevel, setStressLevel] = useState(initialValues?.stressLevel ?? 5);
  const [anxietyLevel, setAnxietyLevel] = useState(initialValues?.anxietyLevel ?? 5);
  const [energyLevel, setEnergyLevel] = useState(initialValues?.energyLevel ?? 5);
  const [sleepQuality, setSleepQuality] = useState(initialValues?.sleepQuality ?? 5);
  const [focusLevel, setFocusLevel] = useState(initialValues?.focusLevel ?? 5);
  const [confidenceLevel, setConfidenceLevel] = useState(initialValues?.confidenceLevel ?? 5);
  const [triggers, setTriggers] = useState<StressTrigger[]>(
    (initialValues?.triggers as StressTrigger[]) ?? [],
  );
  const [reflection, setReflection] = useState(initialValues?.reflection ?? '');
  const [reflectionPromptIdx, setReflectionPromptIdx] = useState<number | null>(null);

  const reflectionId = useId();
  const studyHoursId = useId();

  const [error, setError] = useState<string | null>(null);

  const REFLECTION_PROMPTS = [
    'What is the biggest thing on your mind today?',
    'What feels most out of control right now?',
    'What is one thing you can control today?',
    'What would you tell a friend feeling the same way?',
  ];

  function handleNext() {
    setError(null);
    if (step === 1) {
      if (!examType || !examPhase || studyHours === '') {
        setError('Please complete all fields (exam type, phase, study hours) before continuing.');
        return;
      }
    }
    if (step === 2) {
      if (!mood) {
        setError('Please select your mood before continuing.');
        return;
      }
    }
    if (step === 3) {
      if (triggers.length === 0) {
        setError('Please select at least one stress trigger before continuing.');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 4));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    setError(null);
    if (!examType || !examPhase || studyHours === '' || !mood) {
      setError('Please complete all required fields.');
      return;
    }
    const data: StudentCheckInInput = {
      examType: examType as ExamType,
      examPhase: examPhase as ExamPhase,
      studyHoursPlanned: studyHours as number,
      mood: mood as MoodLabel,
      stressLevel,
      anxietyLevel,
      energyLevel,
      sleepQuality,
      focusLevel,
      confidenceLevel,
      triggers,
      reflection: reflection.slice(0, 1000),
    };
    onSubmit(data);
  }

  function handlePromptSelect(prompt: string, idx: number) {
    setReflection(prompt + ' ');
    setReflectionPromptIdx(idx);
  }

  // Animation variants
  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' as const } }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Stepper currentStep={step} totalSteps={4} labels={STEP_LABELS} />

      <div className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-card-border)] p-6 shadow-sm overflow-hidden min-h-[400px] flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-grow flex flex-col justify-center space-y-6"
          >
            {/* ── Step 1: Exam Context ── */}
            {step === 1 && (
              <fieldset className="space-y-6">
                <legend className="text-xl font-bold text-[var(--color-text)]">
                  Step 1 — Exam Context
                </legend>
                <p className="text-sm text-[var(--color-subtle)]">
                  Tell us about your exam and today&apos;s study plan.
                </p>

                {/* Exam type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--color-text)]">
                    Which exam are you preparing for?
                  </label>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Exam type">
                    {EXAM_TYPES.map((type) => (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={type}
                        type="button"
                        role="radio"
                        aria-checked={examType === type}
                        onClick={() => setExamType(type)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] ${
                          examType === type
                            ? 'bg-[var(--color-teal)] border-[var(--color-teal)] text-[#0F172A]'
                            : 'bg-[var(--color-bg)] border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-lavender)]/50'
                        }`}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Exam phase */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--color-text)]">
                    What phase are you in?
                  </label>
                  <div className="space-y-2" role="group" aria-label="Exam phase">
                    {EXAM_PHASES.map((phase) => (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        key={phase}
                        type="button"
                        role="radio"
                        aria-checked={examPhase === phase}
                        onClick={() => setExamPhase(phase)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] ${
                          examPhase === phase
                            ? 'bg-[var(--color-teal)] border-[var(--color-teal)] text-[#0F172A] font-semibold'
                            : 'bg-[var(--color-bg)] border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-lavender)]/50'
                        }`}
                      >
                        {phase}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Study hours */}
                <div className="space-y-2">
                  <label htmlFor={studyHoursId} className="block text-sm font-semibold text-[var(--color-text)]">
                    Study hours planned today
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id={studyHoursId}
                      type="number"
                      min={0}
                      max={16}
                      value={studyHours}
                      onChange={(e) =>
                        setStudyHours(e.target.value === '' ? '' : Math.max(0, Math.min(16, Number(e.target.value))))
                      }
                      className="w-24 px-3 py-2 border-2 border-[var(--color-card-border)] rounded-xl text-center text-lg font-bold text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:border-[var(--color-lavender)]"
                      aria-label="Study hours planned"
                    />
                    <span className="text-sm text-[var(--color-subtle)]">hours (0–16)</span>
                  </div>
                </div>
              </fieldset>
            )}

            {/* ── Step 2: Mind & Body ── */}
            {step === 2 && (
              <fieldset className="space-y-6">
                <legend className="text-xl font-bold text-[var(--color-text)]">
                  Step 2 — Mind &amp; Body Check
                </legend>
                <p className="text-sm text-[var(--color-subtle)]">
                  Rate how you are feeling right now. Be honest — this helps the plan become more accurate.
                </p>

                {/* Mood chips */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    How would you describe your mood?
                  </p>
                  <div className="grid grid-cols-3 gap-2" role="group" aria-label="Current mood">
                    {MOOD_LABELS.map((m) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={mood === m}
                        onClick={() => setMood(m)}
                        className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] ${
                          mood === m
                            ? 'bg-[var(--color-teal)] border-[var(--color-teal)] text-[#0F172A]'
                            : 'bg-[var(--color-bg)] border-[var(--color-card-border)] hover:border-[var(--color-lavender)]/50 text-[var(--color-muted)]'
                        }`}
                      >
                        <span className="text-2xl" aria-hidden="true">{MOOD_EMOJI[m]}</span>
                        <span className={`text-xs font-medium mt-1 ${mood === m ? 'text-[#0F172A]' : 'text-[var(--color-text)]'}`}>{m}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-5">
                  <SliderField
                    label="Stress level"
                    name="stressLevel"
                    value={stressLevel}
                    onChange={setStressLevel}
                    lowLabel="Very low"
                    highLabel="Overwhelming"
                  />
                  <SliderField
                    label="Anxiety level"
                    name="anxietyLevel"
                    value={anxietyLevel}
                    onChange={setAnxietyLevel}
                    lowLabel="Calm"
                    highLabel="Very anxious"
                  />
                  <SliderField
                    label="Energy level"
                    name="energyLevel"
                    value={energyLevel}
                    onChange={setEnergyLevel}
                    lowLabel="Drained"
                    highLabel="Full energy"
                  />
                  <SliderField
                    label="Sleep quality (last night)"
                    name="sleepQuality"
                    value={sleepQuality}
                    onChange={setSleepQuality}
                    lowLabel="Very poor"
                    highLabel="Great"
                  />
                  <SliderField
                    label="Focus level"
                    name="focusLevel"
                    value={focusLevel}
                    onChange={setFocusLevel}
                    lowLabel="Scattered"
                    highLabel="Sharp"
                  />
                  <SliderField
                    label="Confidence level"
                    name="confidenceLevel"
                    value={confidenceLevel}
                    onChange={setConfidenceLevel}
                    lowLabel="Very low"
                    highLabel="Very high"
                  />
                </div>
              </fieldset>
            )}

            {/* ── Step 3: Triggers ── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">Step 3 — Stress Triggers</h2>
                  <p className="text-sm text-[var(--color-subtle)] mt-1">
                    Select any triggers that feel relevant today. You must select at least one.
                  </p>
                </div>

                <ChipGroup<StressTrigger>
                  label="What is adding to your stress today?"
                  options={STRESS_TRIGGERS}
                  selected={triggers}
                  onChange={setTriggers}
                  emoji={TRIGGER_EMOJI as Record<StressTrigger, string>}
                  description="Select all that apply. Identifying triggers is the first step to addressing them."
                />

                {triggers.length > 0 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-[#729C7C] font-medium">
                    ✅ {triggers.length} trigger{triggers.length !== 1 ? 's' : ''} selected
                  </motion.p>
                )}
              </div>
            )}

            {/* ── Step 4: Reflection ── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">Step 4 — Reflection</h2>
                  <p className="text-sm text-[var(--color-subtle)] mt-1">
                    Take a moment to write what is on your mind. This is private — it stays on your device.
                  </p>
                </div>

                {/* Guided prompts */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[var(--color-subtle)] uppercase tracking-wide">
                    Pick a prompt or write your own:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REFLECTION_PROMPTS.map((prompt, idx) => (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={idx}
                        type="button"
                        onClick={() => handlePromptSelect(prompt, idx)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] ${
                          reflectionPromptIdx === idx
                            ? 'bg-[var(--color-teal)] border-[var(--color-teal)] text-[#0F172A]'
                            : 'bg-[var(--color-bg)] border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-lavender)]/50'
                        }`}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor={reflectionId} className="block text-sm font-semibold text-[var(--color-text)]">
                    Your reflection{' '}
                    <span className="font-normal text-[var(--color-subtle)]">(optional)</span>
                  </label>
                  <textarea
                    id={reflectionId}
                    value={reflection}
                    onChange={(e) => {
                      setReflection(e.target.value.slice(0, 1000));
                      setReflectionPromptIdx(null);
                    }}
                    placeholder="Write what is on your mind today…"
                    rows={5}
                    maxLength={1000}
                    className="w-full px-4 py-3 border-2 border-[var(--color-card-border)] rounded-2xl text-sm text-[var(--color-text)] placeholder-[var(--color-subtle)] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:border-[var(--color-lavender)] transition-colors bg-[var(--color-bg)]"
                    aria-describedby={`${reflectionId}-help`}
                  />
                  <div id={`${reflectionId}-help`} className="flex justify-between text-xs text-[var(--color-subtle)]">
                    <span>Your reflection is stored only on this device.</span>
                    <span>{reflection.length}/1000</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-4 border-t border-[var(--color-card-border)]">
          {step > 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 text-sm font-medium text-[var(--color-subtle)] border-2 border-[var(--color-card-border)] rounded-xl hover:border-[var(--color-lavender)]/50 hover:text-[var(--color-text)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] bg-[var(--color-bg)]"
              aria-label="Go to previous step"
            >
              ← Back
            </motion.button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleNext}
              className="btn-secondary px-6 py-2.5 text-[var(--color-lavender)] border-[var(--color-lavender)]/30 rounded-xl font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] shadow-md"
              aria-label={`Go to step ${step + 1}: ${STEP_LABELS[step]}`}
            >
              Next →
            </motion.button>
          ) : (
            <motion.button
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary px-6 py-2.5 text-[#0F172A] rounded-xl font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Generate your wellness plan"
              aria-busy={isLoading}
            >
              {isLoading ? 'Building plan…' : 'Generate Wellness Plan ✨'}
            </motion.button>
          )}
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500 text-center" role="alert">
          {error}
        </motion.div>
      )}

      {/* Step counter for screen readers */}
      <p className="sr-only" aria-live="polite">
        Step {step} of 4: {STEP_LABELS[step - 1]}
      </p>
    </div>
  );
}
