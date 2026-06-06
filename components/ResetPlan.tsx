'use client';

import type { ResetStep } from '@/lib/types';

const CATEGORY_STYLES: Record<
  ResetStep['category'],
  { bg: string; color: string; border: string; icon: string; label: string }
> = {
  breathe: { bg: 'rgba(45, 212, 191, 0.1)', color: '#7A9E9F', border: 'rgba(45, 212, 191, 0.2)', icon: '🌬️', label: 'Breathe' },
  study: { bg: 'rgba(129, 140, 248, 0.1)', color: '#8C7A6B', border: 'rgba(129, 140, 248, 0.2)', icon: '📖', label: 'Study' },
  recover: { bg: 'rgba(245, 158, 11, 0.1)', color: '#D4A373', border: 'rgba(245, 158, 11, 0.2)', icon: '🌿', label: 'Recover' },
  connect: { bg: 'rgba(167, 139, 250, 0.1)', color: '#A78BFA', border: 'rgba(167, 139, 250, 0.2)', icon: '🤝', label: 'Connect' },
};

interface ResetPlanProps {
  steps: ResetStep[];
}

export default function ResetPlan({ steps }: ResetPlanProps) {
  return (
    <section aria-labelledby="reset-heading" className="space-y-4">
      <h2 id="reset-heading" className="text-base font-bold text-[#1C1917]">
        3-Step Reset Plan
      </h2>
      <p className="text-sm text-[#A8A29E]">
        These three actions will help you reset and move forward today.
      </p>

      <ol className="space-y-3" aria-label="Reset steps">
        {steps.map((step) => {
          const style = CATEGORY_STYLES[step.category];
          return (
            <li
              key={step.step}
              className="bg-[#FFFFFF] rounded-2xl p-4 border flex items-start gap-4 card-hover"
              style={{ borderColor: style.border }}
            >
              {/* Step number */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: style.bg, color: style.color }}
                aria-hidden="true"
              >
                {step.step}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    <span aria-hidden="true">{style.icon}</span>
                    {style.label}
                  </span>
                  <span className="text-xs text-[#D6D1CB]">{step.duration}</span>
                </div>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">{step.action}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
