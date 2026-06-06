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
        <h2 id="triggers-heading" className="text-base font-bold text-[#1C1917]">
          Stress Triggers
        </h2>
        <p className="text-sm text-[#A8A29E]">
          No specific triggers were identified today. General exam pressure is still valid.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="triggers-heading" className="space-y-4">
      <h2 id="triggers-heading" className="text-base font-bold text-[#1C1917]">
        Main Stress Triggers
      </h2>

      <p className="text-sm text-[#CBD5E1] bg-[#FFFFFF] rounded-xl p-4 border border-[#EAE5DF]">
        {triggerSummary}
      </p>

      <ul className="space-y-2" aria-label="Trigger actions">
        {topTriggers.map((trigger) => (
          <li
            key={trigger}
            className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#EAE5DF] card-hover"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
                {TRIGGER_EMOJI[trigger as StressTrigger]}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1C1917] mb-1">{trigger}</p>
                <p className="text-sm text-[#78716C] leading-relaxed">
                  {actionMap[trigger as StressTrigger]}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {Object.keys(actionMap).length > topTriggers.length && (
        <details className="mt-2">
          <summary className="text-sm text-[#8C7A6B] cursor-pointer font-medium hover:text-[#F5E6D3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] rounded">
            See all {Object.keys(actionMap).length} triggers
          </summary>
          <ul className="mt-3 space-y-2">
            {(Object.keys(actionMap) as StressTrigger[])
              .filter((t) => !topTriggers.includes(t))
              .map((trigger) => (
                <li
                  key={trigger}
                  className="bg-[#FDFBF7] rounded-xl p-3 border border-[#EAE5DF]"
                >
                  <span className="text-sm font-medium text-[#CBD5E1]">
                    {TRIGGER_EMOJI[trigger]}&nbsp;{trigger}
                  </span>
                  <p className="text-xs text-[#A8A29E] mt-1">{actionMap[trigger]}</p>
                </li>
              ))}
          </ul>
        </details>
      )}
    </section>
  );
}
