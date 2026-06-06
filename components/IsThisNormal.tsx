'use client';

import { IS_THIS_NORMAL_CARDS } from '@/lib/constants';

export default function IsThisNormal() {
  return (
    <section
      aria-labelledby="normal-heading"
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="mb-6">
        <h2 id="normal-heading" className="text-xl font-bold text-[#1C1917]">
          Is this normal during exams?
        </h2>
        <p className="text-sm text-[#A8A29E] mt-1">
          Common exam-stress experiences, explained simply.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {IS_THIS_NORMAL_CARDS.map(({ question, answer }, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-[#EAE5DF] bg-[#FFFFFF] overflow-hidden card-hover cursor-pointer"
          >
            <summary
              className="flex items-start gap-3 p-4 cursor-pointer list-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] rounded-2xl"
              aria-label={question}
            >
              <span
                className="w-5 h-5 text-[#8C7A6B] text-sm flex-shrink-0 mt-0.5 transition-transform group-open:rotate-90"
                aria-hidden="true"
              >
                ▶
              </span>
              <p className="text-sm font-semibold text-[#CBD5E1]">{question}</p>
            </summary>
            <div className="px-4 pb-4 pt-1">
              <p className="text-sm text-[#78716C] leading-relaxed pl-8">
                {answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
