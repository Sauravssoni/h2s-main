'use client';

import type { EvidenceItem } from '@/lib/types';

interface EvidenceModeProps {
  evidenceItems: EvidenceItem[];
}

const SIGNAL_CONFIG: Record<EvidenceItem['signal'], { label: string; color: string; bg: string }> = {
  high: { label: 'Elevated', color: '#C97A7E', bg: 'rgba(248, 113, 113, 0.12)' },
  medium: { label: 'Moderate', color: '#D4A373', bg: 'rgba(245, 158, 11, 0.12)' },
  low: { label: 'Good', color: '#729C7C', bg: 'rgba(52, 211, 153, 0.12)' },
  neutral: { label: 'Noted', color: '#8C7A6B', bg: 'rgba(140, 122, 107, 0.15)' },
};

export default function EvidenceMode({ evidenceItems }: EvidenceModeProps) {
  return (
    <section
      aria-labelledby="evidence-heading"
      className="rounded-2xl p-5 border border-[#EAE5DF] bg-[#FFFFFF] animate-fade-in"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#8C7A6B] mb-1">
          Evidence Mode
        </p>
        <h3 id="evidence-heading" className="text-base font-bold text-[#1C1917]">
          Why this support plan was generated
        </h3>
        <p className="text-xs text-[#A8A29E] mt-1">
          These are the signals PrepBuddy used to personalise your plan.
        </p>
      </div>

      <div className="space-y-2" role="list" aria-label="Evidence items used to generate your plan">
        {evidenceItems.map((item) => {
          const config = SIGNAL_CONFIG[item.signal];
          return (
            <div
              key={item.label}
              role="listitem"
              className="flex items-center justify-between py-2.5 px-3 rounded-xl border border-[#EAE5DF] bg-[#FDFBF7]/40"
            >
              <span className="text-sm text-[#CBD5E1]">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1C1917]">{item.value}</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ color: config.color, background: config.bg }}
                  aria-label={`Signal: ${config.label}`}
                >
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-[#D6D1CB] italic">
        PrepBuddy is not a diagnosis tool. This analysis is for wellness awareness only.
      </p>
    </section>
  );
}
