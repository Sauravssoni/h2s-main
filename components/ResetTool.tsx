'use client';

import { useState, useEffect, useRef } from 'react';
import type { ResetFeelingLabel } from '@/lib/types';
import { RESET_FEELINGS, RESET_REFRAMES, RESET_NEXT_ACTIONS } from '@/lib/constants';

type ResetPhase = 'choose' | 'breathe' | 'reframe' | 'action';

const BREATHE_PHASES = [
  { label: 'Inhale', duration: 4000, scale: 1.35 },
  { label: 'Hold', duration: 4000, scale: 1.35 },
  { label: 'Exhale', duration: 4000, scale: 1.0 },
  { label: 'Hold', duration: 4000, scale: 1.0 },
];

export default function ResetTool({ onClose }: { onClose?: () => void }) {
  const [phase, setPhase] = useState<ResetPhase>('choose');
  const [feeling, setFeeling] = useState<ResetFeelingLabel>('Anxious');
  const [breathePhaseIdx, setBreathePhaseIdx] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance breathing phases
  useEffect(() => {
    if (phase !== 'breathe') return;

    let phaseIdx = 0;
    let count = 4;
    let cycles = 0;

    function nextPhase() {
      phaseIdx = (phaseIdx + 1) % BREATHE_PHASES.length;
      if (phaseIdx === 0) {
        cycles++;
        if (cycles >= 3) {
          // Done — move to reframe
          setPhase('reframe');
          return;
        }
        setCycleCount(cycles);
      }
      setBreathePhaseIdx(phaseIdx);
      count = 4;
      setCountdown(count);
      scheduleCountdown();
    }

    function scheduleCountdown() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(intervalRef.current!);
          timerRef.current = setTimeout(nextPhase, 100);
        }
      }, 1000);
    }

    scheduleCountdown();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const currentBreathePhase = BREATHE_PHASES[breathePhaseIdx];
  const reframes = RESET_REFRAMES[feeling];
  const chosenReframe = reframes[cycleCount % reframes.length] ?? reframes[0];

  const FEELING_EMOJI: Record<ResetFeelingLabel, string> = {
    Anxious: '😰',
    Defeated: '😔',
    Angry: '😤',
    Numb: '😶',
    Overwhelmed: '😵',
  };

  return (
    <div
      className="rounded-2xl border border-[#1E293B] bg-[#111827] overflow-hidden animate-fade-in"
      role="region"
      aria-label="90-Second Reset Tool"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B]">
        <div>
          <h2 className="text-base font-bold text-[#F8FAFC]">90-Second Reset</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Your books will wait. Your brain will thank you.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#F8FAFC] transition-colors p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8]"
            aria-label="Close reset tool"
          >
            ✕
          </button>
        )}
      </div>

      {/* Phase: Choose feeling */}
      {phase === 'choose' && (
        <div className="p-5 space-y-4">
          <p className="text-sm text-[#CBD5E1]">How are you feeling right now?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="Select your current feeling">
            {RESET_FEELINGS.map((f) => (
              <button
                key={f}
                onClick={() => setFeeling(f)}
                aria-pressed={feeling === f}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8]"
                style={
                  feeling === f
                    ? { background: 'rgba(129, 140, 248, 0.2)', borderColor: '#818CF8', color: '#C7D2FE' }
                    : { background: '#0F172A', borderColor: '#1E293B', color: '#94A3B8' }
                }
              >
                <span aria-hidden="true">{FEELING_EMOJI[f]}</span>
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setBreathePhaseIdx(0);
              setCountdown(4);
              setCycleCount(0);
              setPhase('breathe');
            }}
            className="w-full py-3 bg-[#818CF8] text-white font-semibold rounded-xl hover:bg-[#6366F1] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
            aria-label={`Start 90-second reset for feeling ${feeling}`}
          >
            Start Reset →
          </button>
        </div>
      )}

      {/* Phase: Breathing */}
      {phase === 'breathe' && currentBreathePhase && (
        <div className="p-5 flex flex-col items-center gap-6">
          <p className="text-sm text-[#94A3B8] text-center">
            Cycle {cycleCount + 1}/3 — Follow the circle
          </p>

          {/* Breathing circle */}
          <div
            className="relative flex items-center justify-center"
            role="img"
            aria-label={`Guided box breathing timer. ${currentBreathePhase.label} for ${countdown} seconds.`}
            aria-live="polite"
          >
            {/* Outer glow ring */}
            <div
              className="absolute rounded-full transition-all duration-[3500ms] ease-in-out"
              style={{
                width: `${currentBreathePhase.scale * 160}px`,
                height: `${currentBreathePhase.scale * 160}px`,
                background: 'radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            {/* Main circle */}
            <div
              className="rounded-full flex flex-col items-center justify-center border-2 border-[#818CF8] transition-all duration-[3500ms] ease-in-out"
              style={{
                width: `${currentBreathePhase.scale * 128}px`,
                height: `${currentBreathePhase.scale * 128}px`,
                background: 'rgba(129, 140, 248, 0.1)',
              }}
              aria-hidden="true"
            >
              <span className="text-3xl font-black text-[#818CF8]">{countdown}</span>
              <span className="text-xs text-[#C7D2FE] font-medium mt-1">{currentBreathePhase.label}</span>
            </div>
          </div>

          {/* Steps */}
          <div className="flex gap-2 text-xs text-[#475569]" aria-hidden="true">
            {BREATHE_PHASES.map((p, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full transition-colors"
                style={
                  i === breathePhaseIdx
                    ? { background: 'rgba(129,140,248,0.15)', color: '#C7D2FE' }
                    : {}
                }
              >
                {p.label} {p.duration / 1000}
              </span>
            ))}
          </div>

          <button
            onClick={() => setPhase('choose')}
            className="text-xs text-[#64748B] hover:text-[#94A3B8] transition-colors"
            aria-label="Cancel breathing exercise"
          >
            Skip
          </button>
        </div>
      )}

      {/* Phase: Reframe */}
      {phase === 'reframe' && (
        <div className="p-5 space-y-4 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#818CF8]">
            One reframe
          </p>
          <blockquote className="text-base text-[#F8FAFC] leading-relaxed border-l-2 border-[#818CF8] pl-4 italic">
            &quot;{chosenReframe}&quot;
          </blockquote>
          <button
            onClick={() => setPhase('action')}
            className="w-full py-3 bg-[#818CF8] text-white font-semibold rounded-xl hover:bg-[#6366F1] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
          >
            One next action →
          </button>
        </div>
      )}

      {/* Phase: Action */}
      {phase === 'action' && (
        <div className="p-5 space-y-4 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#34D399]">
            One safe next action
          </p>
          <div className="space-y-2" role="list" aria-label="Suggested next actions">
            {RESET_NEXT_ACTIONS.map((action, i) => (
              <div
                key={i}
                role="listitem"
                className="flex items-start gap-3 p-3 rounded-xl border border-[#1E293B] bg-[#0F172A]/60"
              >
                <span
                  className="w-5 h-5 rounded-full bg-[#818CF8]/20 text-[#818CF8] text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="text-sm text-[#CBD5E1]">{action}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setPhase('choose'); setCycleCount(0); }}
            className="w-full py-2.5 rounded-xl text-sm text-[#64748B] border border-[#1E293B] hover:text-[#94A3B8] hover:border-[#334155] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8]"
          >
            Start again
          </button>
        </div>
      )}
    </div>
  );
}
