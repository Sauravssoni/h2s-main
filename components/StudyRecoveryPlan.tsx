'use client';

import type { StudyRecoveryPlan as StudyRecoveryPlanType } from '@/lib/types';

interface StudyRecoveryPlanProps {
  plan: StudyRecoveryPlanType;
  examPhaseProtocol: string;
}

export default function StudyRecoveryPlan({
  plan,
  examPhaseProtocol,
}: StudyRecoveryPlanProps) {
  return (
    <section aria-labelledby="study-heading" className="space-y-3">
      <h2 id="study-heading" className="text-base font-bold text-[#F8FAFC]">
        Study + Recovery Plan
      </h2>

      {/* Phase protocol */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(129, 140, 248, 0.08)', borderColor: 'rgba(129, 140, 248, 0.2)' }}>
        <p className="text-xs font-semibold text-[#818CF8] uppercase tracking-wide mb-1">
          Exam Phase Advice
        </p>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">{examPhaseProtocol}</p>
      </div>

      {/* Intensity */}
      <div className="bg-[#111827] rounded-2xl p-4 border border-[#1E293B]">
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
          Today&apos;s Intensity
        </p>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">
          {plan.intensityRecommendation}
        </p>
      </div>

      {/* Session blocks */}
      <div className="bg-[#111827] rounded-2xl p-4 border border-[#1E293B]">
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">
          Suggested Study Blocks
        </p>
        <ul className="space-y-2" aria-label="Study session blocks">
          {plan.sessionBlocks.map((block, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#CBD5E1]">
              <span
                className="w-5 h-5 rounded-full bg-[#818CF8]/15 text-[#818CF8] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {block}
            </li>
          ))}
        </ul>
      </div>

      {/* Avoid list */}
      {plan.avoidList.length > 0 && (
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(245, 158, 11, 0.06)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wide mb-2">
            Avoid Today
          </p>
          <ul className="space-y-1" aria-label="Things to avoid today">
            {plan.avoidList.map((item, i) => (
              <li key={i} className="text-sm text-[#CBD5E1] flex items-center gap-2">
                <span aria-hidden="true">⚠️</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recovery action */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(52, 211, 153, 0.06)', borderColor: 'rgba(52, 211, 153, 0.2)' }}>
        <p className="text-xs font-semibold text-[#34D399] uppercase tracking-wide mb-1">
          Evening Recovery
        </p>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">{plan.recoveryAction}</p>
      </div>
    </section>
  );
}
