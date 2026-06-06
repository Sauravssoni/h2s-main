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
      className="rounded-2xl border border-[#EAE5DF] bg-[#FFFFFF] overflow-hidden animate-fade-in"
      role="region"
      aria-label="90-Second Reset Tool"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE5DF]">
        <div>
          <h2 className="text-base font-bold text-[#1C1917]">90-Second Reset</h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Your books will wait. Your brain will thank you.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#A8A29E] hover:text-[#1C1917] transition-colors p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B]"
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
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B]"
                style={
                  feeling === f
                    ? { background: 'rgba(129, 140, 248, 0.2)', borderColor: '#8C7A6B', color: '#F5E6D3' }
                    : { background: '#FDFBF7', borderColor: '#EAE5DF', color: '#78716C' }
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
            className="w-full py-3 bg-[#8C7A6B] text-white font-semibold rounded-xl hover:bg-[#7A6A5C] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF]"
            aria-label={`Start 90-second reset for feeling ${feeling}`}
          >
            Start Reset →
          </button>
        </div>
      )}

      {/* Phase: Breathing */}
      {phase === 'breathe' && currentBreathePhase && (
        <div className="p-5 flex flex-col items-center gap-6">
          <p className="text-sm text-[#78716C] text-center">
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
              className="rounded-full flex flex-col items-center justify-center border-2 border-[#8C7A6B] transition-all duration-[3500ms] ease-in-out"
              style={{
                width: `${currentBreathePhase.scale * 128}px`,
                height: `${currentBreathePhase.scale * 128}px`,
                background: 'rgba(129, 140, 248, 0.1)',
              }}
              aria-hidden="true"
            >
              <span className="text-3xl font-black text-[#8C7A6B]">{countdown}</span>
              <span className="text-xs text-[#F5E6D3] font-medium mt-1">{currentBreathePhase.label}</span>
            </div>
          </div>

          {/* Steps */}
          <div className="flex gap-2 text-xs text-[#D6D1CB]" aria-hidden="true">
            {BREATHE_PHASES.map((p, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full transition-colors"
                style={
                  i === breathePhaseIdx
                    ? { background: 'rgba(129,140,248,0.15)', color: '#F5E6D3' }
                    : {}
                }
              >
                {p.label} {p.duration / 1000}
              </span>
            ))}
          </div>

          <button
            onClick={() => setPhase('choose')}
            className="text-xs text-[#A8A29E] hover:text-[#78716C] transition-colors"
            aria-label="Cancel breathing exercise"
          >
            Skip
          </button>
        </div>
      )}

      {/* Phase: Reframe */}
      {phase === 'reframe' && (
        <div className="p-5 space-y-4 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8C7A6B]">
            One reframe
          </p>
          <blockquote className="text-base text-[#1C1917] leading-relaxed border-l-2 border-[#8C7A6B] pl-4 italic">
            &quot;{chosenReframe}&quot;
          </blockquote>
          <button
            onClick={() => setPhase('action')}
            className="w-full py-3 bg-[#8C7A6B] text-white font-semibold rounded-xl hover:bg-[#7A6A5C] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF]"
          >
            One next action →
          </button>
        </div>
      )}

      {/* Phase: Action */}
      {phase === 'action' && (
        <div className="p-5 space-y-4 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#729C7C]">
            One safe next action
          </p>
          <div className="space-y-2" role="list" aria-label="Suggested next actions">
            {RESET_NEXT_ACTIONS.map((action, i) => (
              <div
                key={i}
                role="listitem"
                className="flex items-start gap-3 p-3 rounded-xl border border-[#EAE5DF] bg-[#FDFBF7]/60"
              >
                <span
                  className="w-5 h-5 rounded-full bg-[#8C7A6B]/20 text-[#8C7A6B] text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5"
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
            className="w-full py-2.5 rounded-xl text-sm text-[#A8A29E] border border-[#EAE5DF] hover:text-[#78716C] hover:border-[#D6D1CB] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B]"
          >
            Start again
          </button>
        </div>
      )}
    </div>
  );
}
