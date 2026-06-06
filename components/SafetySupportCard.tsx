'use client';

import { useState, useEffect } from 'react';
import type { SafetySupport } from '@/lib/types';

interface SafetySupportCardProps {
  support: SafetySupport;
  onOpenReset?: () => void;
}

export default function SafetySupportCard({ support, onOpenReset }: SafetySupportCardProps) {
  const [messagecopied, setMessageCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('prepbuddy:v1:panic_steps');
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCompletedSteps(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleStepComplete = (step: number) => {
    if (completedSteps.includes(step)) return;
    const newSteps = [...completedSteps, step];
    setCompletedSteps(newSteps);
    try {
      localStorage.setItem('prepbuddy:v1:panic_steps', JSON.stringify(newSteps));
    } catch {}
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isCrisis = support.level === 'crisis';
  const isElevated = support.level === 'elevated';
  const showPanic = support.panicToPlan !== null;

  function copyMessage() {
    if (!support.panicToPlan) return;
    const text = support.panicToPlan.shareableMessage;
    navigator.clipboard.writeText(text).then(() => {
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2500);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2500);
    });
  }

  // Crisis card — always visible, only dismissable with explicit confirmation
  if (isCrisis) {
    return (
      <section
        aria-labelledby="crisis-heading"
        aria-live="assertive"
        role="alert"
        className="rounded-2xl p-5 border-2 border-[#C97A7E] animate-pulse-ring"
        style={{ background: 'rgba(248, 113, 113, 0.06)' }}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0" aria-hidden="true">🆘</span>
          <div>
            <h3 id="crisis-heading" className="text-base font-bold text-[#C97A7E]">
              Your wellbeing comes first
            </h3>
            <p className="text-sm text-[#CBD5E1] mt-1 leading-relaxed">
              {support.message}
            </p>
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-2 mb-4" role="list" aria-label="Crisis support resources">
          {support.resources.slice(0, 4).map((r) => (
            <div
              key={r.name}
              role="listitem"
              className="flex items-center justify-between p-3 rounded-xl bg-[#FDFBF7]/60 border border-[#C97A7E]/20"
            >
              <div>
                <p className="text-sm font-semibold text-[#1C1917]">{r.name}</p>
                <p className="text-xs text-[#78716C] mt-0.5">{r.note}</p>
              </div>
              {r.telLink ? (
                <a
                  href={r.telLink}
                  className="ml-3 flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C97A7E]/20 text-[#C97A7E] hover:bg-[#C97A7E]/30 transition-colors"
                  aria-label={`Call ${r.name}: ${r.contact}`}
                >
                  📞 {r.contact}
                </a>
              ) : (
                <span className="ml-3 text-xs text-[#78716C]">{r.contact}</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-[#A8A29E] mb-4">
          Availability may vary. If you are in immediate danger, contact local emergency services or a trusted adult immediately.
        </p>

        {/* Safe dismissal */}
        {!dismissed ? (
          <button
            onClick={() => setDismissed(true)}
            className="w-full py-3 rounded-xl border border-[#C97A7E]/30 text-sm font-semibold text-[#78716C] hover:text-[#1C1917] hover:border-[#C97A7E]/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C97A7E]"
          >
            I am safe right now
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-[#729C7C]/10 border border-[#729C7C]/20 text-sm text-[#729C7C]">
            ✓ Glad you are safe. Support resources remain below whenever you need them.
          </div>
        )}
      </section>
    );
  }

  // Elevated / non-crisis
  if (!isElevated && !showPanic) return null;

  return (
    <section
      aria-labelledby="elevated-support-heading"
      className="rounded-2xl p-5 border border-[#EAE5DF] bg-[#FFFFFF] animate-fade-in"
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">🫂</span>
        <div>
          <h3 id="elevated-support-heading" className="text-base font-bold text-[#1C1917]">
            I feel overwhelmed — Panic-to-Plan
          </h3>
          <p className="text-sm text-[#78716C] mt-1">{support.message}</p>
        </div>
      </div>

      {/* Panic-to-Plan steps */}
      {support.panicToPlan && (
        <div className="space-y-3 mb-4">
          {[
            { step: 1, label: 'Breathe', action: support.panicToPlan.breathingStep, color: '#8C7A6B' },
            { step: 2, label: 'One study action', action: support.panicToPlan.controllableAction, color: '#7A9E9F' },
            { step: 3, label: 'Recovery action', action: support.panicToPlan.recoveryAction, color: '#729C7C' },
          ].map(({ step, label, action, color }) => {
            const isDone = completedSteps.includes(step);
            return (
              <div
                key={step}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                  isDone ? 'border-[#729C7C]/50 bg-[#729C7C]/5' : 'border-[#EAE5DF] bg-[#FDFBF7]/60'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-colors"
                  style={{ background: isDone ? '#729C7C' : `${color}20`, color: isDone ? '#000' : color }}
                  aria-hidden="true"
                >
                  {isDone ? '✓' : step}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#A8A29E] mb-0.5">{label}</p>
                  <p className={`text-sm ${isDone ? 'text-[#78716C] line-through' : 'text-[#CBD5E1]'}`}>{action}</p>
                </div>
                {!isDone && (
                  <button
                    onClick={() => handleStepComplete(step)}
                    className="text-xs px-2 py-1 rounded-lg border border-[#EAE5DF] text-[#78716C] hover:bg-[#EAE5DF] hover:text-[#1C1917] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B]"
                  >
                    I did this
                  </button>
                )}
              </div>
            );
          })}

          {/* Copyable support message */}
          <div className="p-3 rounded-xl border border-[#EAE5DF] bg-[#FDFBF7]/60">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[#A8A29E]">Copyable support message</p>
              <button
                onClick={copyMessage}
                className="text-xs font-semibold px-2 py-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B]"
                style={
                  messagecopied
                    ? { color: '#729C7C', background: 'rgba(52,211,153,0.1)' }
                    : { color: '#8C7A6B', background: 'rgba(129,140,248,0.1)' }
                }
                aria-label="Copy support message to clipboard"
              >
                {messagecopied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <p className="text-sm text-[#78716C] italic">
              &quot;{support.panicToPlan.shareableMessage}&quot;
            </p>
          </div>
        </div>
      )}

      {/* 90s reset CTA */}
      {onOpenReset && (
        <button
          onClick={onOpenReset}
          className="w-full mb-3 py-2.5 rounded-xl text-sm font-semibold text-[#8C7A6B] border border-[#8C7A6B]/30 hover:border-[#8C7A6B]/60 hover:bg-[#8C7A6B]/5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B]"
          aria-label="Open 90-second reset tool"
        >
          ⏱ Start 90-Second Reset
        </button>
      )}

      {/* Resources */}
      {support.resources.length > 0 && (
        <div className="space-y-2" role="list" aria-label="Support helplines">
          {support.resources.slice(0, 2).map((r) => (
            <div
              key={r.name}
              role="listitem"
              className="flex items-center justify-between p-3 rounded-xl border border-[#EAE5DF] bg-[#FDFBF7]/40"
            >
              <div>
                <p className="text-xs font-semibold text-[#1C1917]">{r.name}</p>
              </div>
              {r.telLink ? (
                <a
                  href={r.telLink}
                  className="text-xs font-bold text-[#7A9E9F] hover:text-[#729C7C] transition-colors"
                  aria-label={`Call ${r.name}: ${r.contact}`}
                >
                  {r.contact}
                </a>
              ) : (
                <span className="text-xs text-[#A8A29E]">{r.contact}</span>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#729C7C] text-[#022C22] px-4 py-2 rounded-xl text-sm font-bold shadow-lg animate-fade-in z-50">
          Great job taking a safe step!
        </div>
      )}
    </section>
  );
}
