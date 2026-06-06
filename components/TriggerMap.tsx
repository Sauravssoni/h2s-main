'use client';

import type { TriggerAnalysis, StressTrigger } from '@/lib/types';
import { TRIGGER_EMOJI } from '@/lib/constants';

interface TriggerMapProps {
  analysis: TriggerAnalysis;
}

export default function TriggerMap({ analysis }: TriggerMapProps) {
  const { topTriggers, triggerSummary, actionMap } = analysis;

  if (topTriggers.length === 0) {
    return (
      <section aria-labelledby="triggers-heading" className="space-y-3">
        <h2 id="triggers-heading" className="text-base font-bold text-[#F8FAFC]">
          Stress Triggers
        </h2>
        <p className="text-sm text-[#64748B]">
          No specific triggers were identified today. General exam pressure is still valid.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="triggers-heading" className="space-y-4">
      <h2 id="triggers-heading" className="text-base font-bold text-[#F8FAFC]">
        Main Stress Triggers
      </h2>

      <p className="text-sm text-[#CBD5E1] bg-[#111827] rounded-xl p-4 border border-[#1E293B]">
        {triggerSummary}
      </p>

      <ul className="space-y-2" aria-label="Trigger actions">
        {topTriggers.map((trigger) => (
          <li
            key={trigger}
            className="bg-[#111827] rounded-2xl p-4 border border-[#1E293B] card-hover"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
                {TRIGGER_EMOJI[trigger as StressTrigger]}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC] mb-1">{trigger}</p>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {actionMap[trigger as StressTrigger]}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {Object.keys(actionMap).length > topTriggers.length && (
        <details className="mt-2">
          <summary className="text-sm text-[#818CF8] cursor-pointer font-medium hover:text-[#C7D2FE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] rounded">
            See all {Object.keys(actionMap).length} triggers
          </summary>
          <ul className="mt-3 space-y-2">
            {(Object.keys(actionMap) as StressTrigger[])
              .filter((t) => !topTriggers.includes(t))
              .map((trigger) => (
                <li
                  key={trigger}
                  className="bg-[#0F172A] rounded-xl p-3 border border-[#1E293B]"
                >
                  <span className="text-sm font-medium text-[#CBD5E1]">
                    {TRIGGER_EMOJI[trigger]}&nbsp;{trigger}
                  </span>
                  <p className="text-xs text-[#64748B] mt-1">{actionMap[trigger]}</p>
                </li>
              ))}
          </ul>
        </details>
      )}
    </section>
  );
}
