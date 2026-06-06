'use client';

import { IS_THIS_NORMAL_CARDS } from '@/lib/constants';

export default function IsThisNormal() {
  return (
    <section
      aria-labelledby="normal-heading"
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="mb-6">
        <h2 id="normal-heading" className="text-xl font-bold text-[var(--color-teal)]">
          Is this normal during exams?
        </h2>
        <p className="text-sm text-[var(--color-subtle)] mt-1">
          Common exam-stress experiences, explained simply.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {IS_THIS_NORMAL_CARDS.map(({ question, answer }, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] overflow-hidden card-hover cursor-pointer"
          >
            <summary
              className="flex items-start gap-3 p-4 cursor-pointer list-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] rounded-2xl"
              aria-label={question}
            >
              <span
                className="w-5 h-5 text-[var(--color-lavender)] text-sm flex-shrink-0 mt-0.5 transition-transform group-open:rotate-90"
                aria-hidden="true"
              >
                ▶
              </span>
              <p className="text-sm font-semibold text-[var(--color-text)]">{question}</p>
            </summary>
            <div className="px-4 pb-4 pt-1">
              <p className="text-sm text-[var(--color-muted)] leading-relaxed pl-8 font-medium">
                {answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
