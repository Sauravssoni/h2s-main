'use client';

import { useState, useId } from 'react';
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

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Stepper currentStep={step} totalSteps={4} labels={STEP_LABELS} />

      <div className="bg-[#FFFFFF] rounded-3xl border border-[#EAE5DF] p-6 space-y-6">
        {/* ── Step 1: Exam Context ── */}
        {step === 1 && (
          <fieldset className="space-y-6">
            <legend className="text-xl font-bold text-[#1C1917]">
              Step 1 — Exam Context
            </legend>
            <p className="text-sm text-[#A8A29E]">
              Tell us about your exam and today&apos;s study plan.
            </p>

            {/* Exam type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#CBD5E1]">
                Which exam are you preparing for?
              </label>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Exam type">
                {EXAM_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={examType === type}
                    onClick={() => setExamType(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFFFFF] ${
                      examType === type
                        ? 'bg-[#8C7A6B]/20 border-[#8C7A6B] text-[#F5E6D3]'
                        : 'bg-[#FDFBF7] border-[#EAE5DF] text-[#78716C] hover:border-[#8C7A6B]/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam phase */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#CBD5E1]">
                What phase are you in?
              </label>
              <div className="space-y-2" role="group" aria-label="Exam phase">
                {EXAM_PHASES.map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    role="radio"
                    aria-checked={examPhase === phase}
                    onClick={() => setExamPhase(phase)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFFFFF] ${
                      examPhase === phase
                        ? 'bg-[#8C7A6B]/15 border-[#8C7A6B] text-[#F5E6D3] font-semibold'
                        : 'bg-[#FDFBF7] border-[#EAE5DF] text-[#78716C] hover:border-[#8C7A6B]/50'
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>
            </div>

            {/* Study hours */}
            <div className="space-y-2">
              <label htmlFor={studyHoursId} className="block text-sm font-semibold text-[#CBD5E1]">
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
                  className="w-24 px-3 py-2 border-2 border-[#EAE5DF] rounded-xl text-center text-lg font-bold text-[#1C1917] bg-[#FDFBF7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:border-[#8C7A6B]"
                  aria-label="Study hours planned"
                />
                <span className="text-sm text-[#A8A29E]">hours (0–16)</span>
              </div>
            </div>
          </fieldset>
        )}

        {/* ── Step 2: Mind & Body ── */}
        {step === 2 && (
          <fieldset className="space-y-6">
            <legend className="text-xl font-bold text-[#1C1917]">
              Step 2 — Mind &amp; Body Check
            </legend>
            <p className="text-sm text-[#A8A29E]">
              Rate how you are feeling right now. Be honest — this helps the plan become more accurate.
            </p>

            {/* Mood chips */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#CBD5E1]">
                How would you describe your mood?
              </p>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Current mood">
                {MOOD_LABELS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mood === m}
                    onClick={() => setMood(m)}
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFFFFF] ${
                      mood === m
                        ? 'bg-[#8C7A6B]/15 border-[#8C7A6B]'
                        : 'bg-[#FDFBF7] border-[#EAE5DF] hover:border-[#8C7A6B]/50'
                    }`}
                  >
                    <span className="text-2xl" aria-hidden="true">{MOOD_EMOJI[m]}</span>
                    <span className="text-xs font-medium text-[#CBD5E1] mt-1">{m}</span>
                  </button>
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
              <h2 className="text-xl font-bold text-[#1C1917]">Step 3 — Stress Triggers</h2>
              <p className="text-sm text-[#A8A29E] mt-1">
                Select any triggers that feel relevant today. You can select multiple.
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
              <p className="text-xs text-[#729C7C] font-medium">
                ✅ {triggers.length} trigger{triggers.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {/* ── Step 4: Reflection ── */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#1C1917]">Step 4 — Reflection</h2>
              <p className="text-sm text-[#A8A29E] mt-1">
                Take a moment to write what is on your mind. This is private — it stays on your device.
              </p>
            </div>

            {/* Guided prompts */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-wide">
                Pick a prompt or write your own:
              </p>
              <div className="flex flex-wrap gap-2">
                {REFLECTION_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptSelect(prompt, idx)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFFFFF] ${
                      reflectionPromptIdx === idx
                        ? 'bg-[#8C7A6B]/20 border-[#8C7A6B] text-[#F5E6D3]'
                        : 'bg-[#FDFBF7] border-[#EAE5DF] text-[#78716C] hover:border-[#8C7A6B]/50'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor={reflectionId} className="block text-sm font-semibold text-[#CBD5E1]">
                Your reflection{' '}
                <span className="font-normal text-[#A8A29E]">(optional)</span>
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
                className="w-full px-4 py-3 border-2 border-[#EAE5DF] rounded-2xl text-sm text-[#1C1917] placeholder-[#D6D1CB] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:border-[#8C7A6B] transition-colors bg-[#FDFBF7]"
                aria-describedby={`${reflectionId}-help`}
              />
              <div id={`${reflectionId}-help`} className="flex justify-between text-xs text-[#A8A29E]">
                <span>Your reflection is stored only on this device.</span>
                <span>{reflection.length}/1000</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EAE5DF]">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 text-sm font-medium text-[#A8A29E] border-2 border-[#EAE5DF] rounded-xl hover:border-[#8C7A6B]/50 hover:text-[#8C7A6B] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFFFFF]"
              aria-label="Go to previous step"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFFFFF] shadow-md shadow-[#8C7A6B]/20"
              style={{ background: 'linear-gradient(135deg, #8C7A6B, #7A6A5C)' }}
              aria-label={`Go to step ${step + 1}: ${STEP_LABELS[step]}`}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2.5 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9E9F] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFFFFF] shadow-md shadow-[#7A9E9F]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #7A9E9F, #729C7C)' }}
              aria-label="Generate your wellness plan"
              aria-busy={isLoading}
            >
              {isLoading ? 'Building plan…' : 'Generate Wellness Plan ✨'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center animate-fade-in" role="alert">
          {error}
        </div>
      )}

      {/* Step counter for screen readers */}
      <p className="sr-only" aria-live="polite">
        Step {step} of 4: {STEP_LABELS[step - 1]}
      </p>
    </div>
  );
}
