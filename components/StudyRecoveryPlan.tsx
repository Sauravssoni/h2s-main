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
      <h2 id="study-heading" className="text-base font-bold text-[#1C1917]">
        Study + Recovery Plan
      </h2>

      {/* Phase protocol */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(129, 140, 248, 0.08)', borderColor: 'rgba(129, 140, 248, 0.2)' }}>
        <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wide mb-1">
          Exam Phase Advice
        </p>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">{examPhaseProtocol}</p>
      </div>

      {/* Intensity */}
      <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#EAE5DF]">
        <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-wide mb-2">
          Today&apos;s Intensity
        </p>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">
          {plan.intensityRecommendation}
        </p>
      </div>

      {/* Session blocks */}
      <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#EAE5DF]">
        <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-wide mb-3">
          Suggested Study Blocks
        </p>
        <ul className="space-y-2" aria-label="Study session blocks">
          {plan.sessionBlocks.map((block, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#CBD5E1]">
              <span
                className="w-5 h-5 rounded-full bg-[#8C7A6B]/15 text-[#8C7A6B] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
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
          <p className="text-xs font-semibold text-[#D4A373] uppercase tracking-wide mb-2">
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
        <p className="text-xs font-semibold text-[#729C7C] uppercase tracking-wide mb-1">
          Evening Recovery
        </p>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">{plan.recoveryAction}</p>
      </div>
    </section>
  );
}
