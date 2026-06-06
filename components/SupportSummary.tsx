'use client';

import { useState } from 'react';
import type { MentorSummary } from '@/lib/types';

interface SupportSummaryProps {
  summary: MentorSummary;
}

export default function SupportSummary({ summary }: SupportSummaryProps) {
  const [copied, setCopied] = useState(false);

  const summaryText = `PrepBuddy — Support Summary for Mentor / Parent / Counsellor
Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

Average stress level: ${summary.averageStress}/10
Average sleep quality: ${summary.averageSleep}/10
Average confidence: ${summary.averageConfidence}/10
Top triggers: ${summary.topTriggers.join(', ') || 'None recorded'}
Recurring stress loop: ${summary.recurringLoop}

Recent reflection:
${summary.recentReflectionSummary}

Suggested support:
${summary.suggestedSupport}

—
DISCLAIMER: This is not a medical report or diagnosis. It is a student-created support summary to help a trusted person provide calm, informed support.
PrepBuddy is not a therapy replacement or clinical tool.`;

  function handleCopy() {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = summaryText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <section
      aria-labelledby="support-summary-heading"
      className="rounded-2xl p-5 border border-[#EAE5DF] bg-[#FFFFFF] animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7A9E9F] mb-1">
            Support Summary
          </p>
          <h3 id="support-summary-heading" className="text-base font-bold text-[#1C1917]">
            For Mentor / Parent / Counsellor
          </h3>
          <p className="text-xs text-[#A8A29E] mt-1">
            Share this with someone you trust to get calm, informed support.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9E9F]"
          style={
            copied
              ? { background: 'rgba(52, 211, 153, 0.15)', borderColor: '#729C7C', color: '#729C7C' }
              : { background: '#FDFBF7', borderColor: '#EAE5DF', color: '#78716C' }
          }
          aria-label="Copy support summary to clipboard"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Avg Stress', value: `${summary.averageStress}/10`, color: summary.averageStress >= 7 ? '#C97A7E' : '#729C7C' },
          { label: 'Avg Sleep', value: `${summary.averageSleep}/10`, color: summary.averageSleep <= 5 ? '#C97A7E' : '#729C7C' },
          { label: 'Avg Confidence', value: `${summary.averageConfidence}/10`, color: summary.averageConfidence <= 4 ? '#C97A7E' : '#729C7C' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center p-2.5 rounded-xl bg-[#FDFBF7]/60 border border-[#EAE5DF]">
            <p className="text-xs text-[#A8A29E] mb-1">{label}</p>
            <p className="text-sm font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        {summary.topTriggers.length > 0 && (
          <div>
            <p className="text-xs text-[#A8A29E] mb-1">Top triggers</p>
            <div className="flex flex-wrap gap-1.5">
              {summary.topTriggers.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-[#EAE5DF] text-[#78716C]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {summary.recurringLoop !== 'None detected.' && (
          <div className="p-3 rounded-xl bg-[#FDFBF7]/60 border border-[#EAE5DF]">
            <p className="text-xs text-[#A8A29E] mb-1">Recurring stress pattern</p>
            <p className="text-sm text-[#CBD5E1]">{summary.recurringLoop}</p>
          </div>
        )}

        <div className="p-3 rounded-xl bg-[#FDFBF7]/60 border border-[#EAE5DF]">
          <p className="text-xs text-[#A8A29E] mb-1">Suggested support</p>
          <p className="text-sm text-[#1C1917] leading-relaxed">{summary.suggestedSupport}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#D6D1CB] border-t border-[#EAE5DF] pt-3">
        This is not a medical report or diagnosis. It is a student-created support summary.
        PrepBuddy is not a therapy replacement or clinical tool.
      </p>
    </section>
  );
}
