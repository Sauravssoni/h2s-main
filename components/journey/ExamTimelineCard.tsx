'use client';

import type { ExamTimeline } from '@/lib/types';

interface ExamTimelineCardProps {
  timeline: ExamTimeline;
}

export default function ExamTimelineCard({ timeline }: ExamTimelineCardProps) {
  if (timeline.daysLeft === null) return null;

  const phaseLabel = timeline.daysLeft >= 0
    ? `${timeline.daysLeft} day${timeline.daysLeft === 1 ? '' : 's'} left`
    : 'Exam date passed';

  return (
    <div
      className="bg-[var(--color-card)] rounded-2xl p-5 border border-[var(--color-card-border)] shadow-sm"
      role="region"
      aria-label="Exam timeline"
    >
      <h2 className="text-sm font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
        <span aria-hidden="true">📅</span>
        Exam Timeline
      </h2>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-teal)]/10 text-[var(--color-teal)] border border-[var(--color-teal)]/20">
          {phaseLabel}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-lavender)]/10 text-[var(--color-lavender)] border border-[var(--color-lavender)]/20">
          {timeline.timelinePhase}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-amber)]/10 text-[var(--color-amber)] border border-[var(--color-amber)]/20">
          {timeline.paceMode}
        </span>
      </div>

      <p className="text-sm text-[var(--color-muted)] leading-relaxed font-medium">
        {timeline.advice}
      </p>
    </div>
  );
}
