'use client';

import { useState } from 'react';
import type { WellnessPlan, JourneyStats } from '@/lib/types';
import WellnessSnapshot from './WellnessSnapshot';
import TriggerMap from './TriggerMap';
import ResetPlan from './ResetPlan';
import StudyRecoveryPlan from './StudyRecoveryPlan';
import SafetySupportCard from './SafetySupportCard';
import JourneyDashboard from './JourneyDashboard';
import StressLoopCard from './StressLoopCard';
import EvidenceMode from './EvidenceMode';
import SupportResources from './SupportResources';
import ResetTool from './ResetTool';

interface ResultsDashboardProps {
  plan: WellnessPlan;
  journeyStats: JourneyStats;
  onNewCheckIn: () => void;
  onClearData: () => void;
  examType?: WellnessPlan['safetySupport']['resources'][0]['showFor'] extends Array<infer T> ? T : never;
}

export default function ResultsDashboard({
  plan,
  journeyStats,
  onNewCheckIn,
  onClearData,
}: ResultsDashboardProps) {
  const [showReset, setShowReset] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6" id="results-main">
      {/* Header */}
      <header className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#EAE5DF] text-[#8C7A6B] px-4 py-1.5 rounded-full text-sm font-semibold">
          <span aria-hidden="true">✅</span>
          Check-in complete
        </div>
        <h1 className="text-2xl font-bold text-[#1C1917]">
          Your Wellness Plan
        </h1>
        <p className="text-sm text-[#A8A29E]">
          Based on your check-in ·{' '}
          {new Date(plan.generatedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </header>

      {/* Crisis card shown at top — always */}
      {plan.safetySupport.level === 'crisis' && (
        <SafetySupportCard support={plan.safetySupport} onOpenReset={() => setShowReset(true)} />
      )}

      {/* Panic-to-Plan — elevated */}
      {plan.safetySupport.level === 'elevated' && (
        <SafetySupportCard support={plan.safetySupport} onOpenReset={() => setShowReset(true)} />
      )}

      {/* 90-second reset */}
      {showReset && (
        <ResetTool onClose={() => setShowReset(false)} />
      )}

      {/* Inline reset CTA if high stress and not already shown */}
      {!showReset && plan.snapshot.stressLevel >= 7 && plan.safetySupport.level === 'normal' && (
        <button
          onClick={() => setShowReset(true)}
          className="w-full py-3 rounded-2xl text-sm font-semibold text-[#7A9E9F] border border-[#7A9E9F]/30 hover:border-[#7A9E9F]/60 hover:bg-[#7A9E9F]/5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9E9F]"
          aria-label="Open 90-second exam stress reset"
        >
          ⏱ Try the 90-Second Reset
        </button>
      )}

      <div
        className="space-y-6"
        aria-live="polite"
        aria-label="Your personalised wellness plan"
      >
        {/* Snapshot */}
        <WellnessSnapshot snapshot={plan.snapshot} />

        {/* Stress loop card */}
        {plan.detectedStressLoop && (
          <StressLoopCard loop={plan.detectedStressLoop} />
        )}

        {/* Trigger map */}
        <TriggerMap analysis={plan.triggerAnalysis} />

        {/* Pain points */}
        {plan.detectedPainPoints.length > 0 && (
          <section aria-labelledby="pain-points-heading" className="space-y-3">
            <h2 id="pain-points-heading" className="text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span aria-hidden="true">🔍</span> Detected Patterns
            </h2>
            <div className="space-y-2">
              {plan.detectedPainPoints.slice(0, 3).map((pp) => (
                <div
                  key={pp.id}
                  className="p-4 rounded-xl border border-[#EAE5DF] bg-[#FFFFFF]"
                >
                  <p className="text-sm text-[#CBD5E1] leading-relaxed">{pp.message}</p>
                  <div className="flex items-start gap-2 mt-2">
                    <span className="text-[#8C7A6B] text-xs font-bold flex-shrink-0" aria-hidden="true">→</span>
                    <p className="text-xs text-[#8C7A6B] font-medium">{pp.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reset plan */}
        <ResetPlan steps={plan.resetSteps} />

        {/* Study + recovery plan */}
        <StudyRecoveryPlan
          plan={plan.studyRecoveryPlan}
          examPhaseProtocol={plan.examPhaseProtocol}
        />

        {/* Reflection insight */}
        <section aria-labelledby="reflection-heading" className="space-y-3">
          <h2 id="reflection-heading" className="text-base font-bold text-[#1C1917]">
            Reflection Insight
          </h2>
          <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#EAE5DF]">
            <p className="text-sm text-[#CBD5E1] leading-relaxed italic">
              &ldquo;{plan.reflectionInsight}&rdquo;
            </p>
          </div>
        </section>

        {/* Calm exercise */}
        <section aria-labelledby="calm-heading" className="space-y-3">
          <h2 id="calm-heading" className="text-base font-bold text-[#1C1917]">
            {plan.calmExercise.name}
          </h2>
          <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#EAE5DF] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#A8A29E]">{plan.calmExercise.description}</p>
              <span className="text-xs font-medium text-[#8C7A6B] bg-[#8C7A6B]/10 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                {plan.calmExercise.duration}
              </span>
            </div>
            <ol className="space-y-1.5" aria-label={`${plan.calmExercise.name} steps`}>
              {plan.calmExercise.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#CBD5E1]">
                  <span
                    className="w-5 h-5 rounded-full bg-[#8C7A6B]/15 text-[#8C7A6B] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Evidence mode toggle */}
        <div>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-xs text-[#D6D1CB] hover:text-[#A8A29E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] rounded"
            aria-expanded={showEvidence}
          >
            {showEvidence ? '▲ Hide evidence' : '▼ Why was this plan generated?'}
          </button>
          {showEvidence && (
            <div className="mt-3">
              <EvidenceMode evidenceItems={plan.evidenceItems} />
            </div>
          )}
        </div>

        {/* Journey dashboard */}
        <JourneyDashboard stats={journeyStats} onClearData={onClearData} />

        {/* Support resources */}
        <SupportResources showAll={false} />

        {/* Normal support card */}
        {plan.safetySupport.level === 'normal' && (
          <SafetySupportCard support={plan.safetySupport} onOpenReset={() => setShowReset(true)} />
        )}
      </div>

      {/* CTA */}
      <div className="text-center pt-4 pb-8">
        <button
          onClick={onNewCheckIn}
          className="px-8 py-3 text-white rounded-2xl font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
          style={{ background: 'linear-gradient(135deg, #8C7A6B, #7A6A5C)' }}
          aria-label="Start a new wellness check-in"
        >
          New Check-In →
        </button>
        <p className="text-xs text-[#D6D1CB] mt-3">
          Come back tomorrow to track your academic journey.
        </p>
      </div>
    </main>
  );
}
