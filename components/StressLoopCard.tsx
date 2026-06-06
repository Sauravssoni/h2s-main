'use client';

import type { DetectedStressLoop } from '@/lib/types';

interface StressLoopCardProps {
  loop: DetectedStressLoop;
}

const LOOP_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  'score-rumination': {
    color: '#C97A7E',
    bg: 'rgba(248, 113, 113, 0.08)',
    border: 'rgba(248, 113, 113, 0.2)',
  },
  'backlog-paralysis': {
    color: '#D4A373',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
  },
  'insomnia-fatigue': {
    color: '#8C7A6B',
    bg: 'rgba(129, 140, 248, 0.08)',
    border: 'rgba(129, 140, 248, 0.2)',
  },
  'result-limbo': {
    color: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.08)',
    border: 'rgba(167, 139, 250, 0.2)',
  },
  'expectation-pressure': {
    color: '#F4A261',
    bg: 'rgba(244, 162, 97, 0.08)',
    border: 'rgba(244, 162, 97, 0.2)',
  },
  'exam-freeze': {
    color: '#7A9E9F',
    bg: 'rgba(45, 212, 191, 0.08)',
    border: 'rgba(45, 212, 191, 0.2)',
  },
};

export default function StressLoopCard({ loop }: StressLoopCardProps) {
  const colors = LOOP_COLORS[loop.id] ?? {
    color: '#8C7A6B',
    bg: 'rgba(129, 140, 248, 0.08)',
    border: 'rgba(129, 140, 248, 0.2)',
  };

  // Parse chain into individual steps
  const chainSteps = loop.chain.split('→').map((s) => s.trim()).filter(Boolean);

  return (
    <section
      aria-labelledby="stress-loop-heading"
      className="rounded-2xl p-5 border animate-fade-in"
      style={{ background: colors.bg, borderColor: colors.border }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: colors.color }}
          aria-hidden="true"
        />
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: colors.color }}>
          Detected Exam Stress Loop
        </p>
      </div>

      <h3 id="stress-loop-heading" className="text-base font-bold text-[#1C1917] mb-3">
        {loop.name}
      </h3>

      {/* Chain visualization */}
      <div
        className="flex flex-wrap items-center gap-2 mb-4"
        aria-label={`Stress chain: ${loop.chain}`}
      >
        {chainSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="text-xs font-medium px-2 py-1 rounded-lg"
              style={{ background: `${colors.color}18`, color: colors.color }}
            >
              {step}
            </span>
            {i < chainSteps.length - 1 && (
              <span className="text-[#D6D1CB] text-xs font-bold" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="flex items-start gap-2 rounded-xl p-3 bg-[#FDFBF7]/40">
        <span className="text-lg" aria-hidden="true">⚡</span>
        <div>
          <p className="text-xs font-semibold text-[#CBD5E1] mb-0.5">One safe next action</p>
          <p className="text-sm text-[#1C1917]">{loop.action}</p>
        </div>
      </div>
    </section>
  );
}
