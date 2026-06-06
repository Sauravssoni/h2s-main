'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Wind } from 'lucide-react';
import type { ResetFeelingLabel } from '@/lib/types';
import { RESET_FEELINGS, RESET_REFRAMES, RESET_NEXT_ACTIONS } from '@/lib/constants';

type ResetPhase = 'choose' | 'breathe' | 'reframe' | 'action';

const BREATHE_PHASES = [
  { label: 'Inhale', duration: 4000, scale: 1.4 },
  { label: 'Hold', duration: 4000, scale: 1.4 },
  { label: 'Exhale', duration: 4000, scale: 1.0 },
  { label: 'Hold', duration: 4000, scale: 1.0 },
];

export default function ResetTool({ onClose }: { onClose?: () => void }) {
  const [phase, setPhase] = useState<ResetPhase>('choose');
  const [feeling, setFeeling] = useState<ResetFeelingLabel>('Anxious');
  
  const [breathePhaseIdx, setBreathePhaseIdx] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance breathing phases
  useEffect(() => {
    if (phase !== 'breathe' || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    let count = countdown;
    let phaseIdx = breathePhaseIdx;
    let cycles = cycleCount;

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
      count = BREATHE_PHASES[phaseIdx].duration / 1000;
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
          timerRef.current = setTimeout(nextPhase, 50);
        }
      }, 1000);
    }

    scheduleCountdown();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, isPaused]); // Removed breathePhaseIdx, cycleCount, countdown from deps to avoid re-triggering

  const currentBreathePhase = BREATHE_PHASES[breathePhaseIdx];
  const reframes = RESET_REFRAMES[feeling];
  // Override reframe per instructions
  const chosenReframe = "Your mock score is a compass, not a verdict.";

  const FEELING_EMOJI: Record<ResetFeelingLabel, string> = {
    Anxious: '😰',
    Defeated: '😔',
    Angry: '😤',
    Numb: '😶',
    Overwhelmed: '😵',
  };

  const handleRestart = () => {
    setBreathePhaseIdx(0);
    setCountdown(4);
    setCycleCount(0);
    setIsPaused(false);
  };

  return (
    <div
      className="rounded-3xl border border-[var(--color-card-border)] bg-[var(--color-card)] shadow-2xl overflow-hidden relative"
      role="region"
      aria-label="90-Second Reset Tool"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[var(--color-teal)]/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[var(--color-card-border)]/50">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--color-teal)]/20 p-2 rounded-xl text-[var(--color-teal)]">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">90-Second Reset</h2>
            <p className="text-xs font-medium text-[var(--color-subtle)] mt-0.5">
              Your books will wait. Your brain needs oxygen first.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--color-subtle)] hover:text-[var(--color-text)] transition-colors p-2 rounded-lg bg-[var(--color-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)]"
            aria-label="Close reset tool"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Phase: Choose feeling */}
        {phase === 'choose' && (
          <motion.div 
            key="choose"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="p-6 space-y-5 relative z-10"
          >
            <p className="text-sm font-medium text-[var(--color-muted)]">How are you feeling right now?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="group" aria-label="Select your current feeling">
              {RESET_FEELINGS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFeeling(f)}
                  aria-pressed={feeling === f}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)]"
                  style={
                    feeling === f
                      ? { background: 'var(--color-lavender)', color: '#0F172A', boxShadow: '0 4px 12px rgba(199, 210, 254, 0.4)' }
                      : { background: 'var(--color-bg)', border: '1px solid var(--color-card-border)', color: 'var(--color-subtle)' }
                  }
                >
                  <span aria-hidden="true" className="text-lg">{FEELING_EMOJI[f]}</span>
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                handleRestart();
                setPhase('breathe');
              }}
              className="btn-primary w-full py-4 text-[var(--color-bg)] font-black rounded-xl text-base shadow-lg focus:outline-none"
              aria-label={`Start 90-second reset for feeling ${feeling}`}
            >
              Start Reset →
            </button>
          </motion.div>
        )}

        {/* Phase: Breathing */}
        {phase === 'breathe' && currentBreathePhase && (
          <motion.div 
            key="breathe"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-8 flex flex-col items-center gap-8 relative z-10"
          >
            <div className="flex w-full justify-between items-center text-xs font-bold text-[var(--color-subtle)] uppercase tracking-wider">
              <span>Cycle {cycleCount + 1}/3</span>
              <span className="bg-[var(--color-bg)] px-3 py-1 rounded-full border border-[var(--color-card-border)]">Box Breathing</span>
            </div>

            {/* Breathing Orb */}
            <div
              className="relative flex items-center justify-center w-64 h-64 my-4"
              role="img"
              aria-label={`Guided box breathing timer. ${currentBreathePhase.label} for ${countdown} seconds.`}
              aria-live="polite"
            >
              {/* Animated Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="var(--color-card-border)" strokeWidth="2" />
                <motion.circle 
                  cx="50" cy="50" r="48" fill="none" stroke="var(--color-teal)" strokeWidth="2" strokeLinecap="round"
                  initial={{ strokeDasharray: "301.59", strokeDashoffset: "301.59" }}
                  animate={{ strokeDashoffset: isPaused ? undefined : 0 }}
                  transition={{ duration: 4, ease: "linear", repeat: isPaused ? 0 : Infinity }}
                />
              </svg>

              {/* Breathing Circle */}
              <motion.div
                className="rounded-full flex flex-col items-center justify-center border-2 border-[var(--color-teal)]/50 shadow-[0_0_30px_rgba(45,212,191,0.2)] bg-gradient-to-br from-[var(--color-teal)]/20 to-transparent backdrop-blur-sm"
                animate={isPaused ? { scale: 1 } : { scale: currentBreathePhase.scale }}
                transition={{ duration: 4, ease: "easeInOut" }}
                style={{ width: '120px', height: '120px' }}
              >
                <span className="text-4xl font-black text-[var(--color-teal)] drop-shadow-md">{countdown}</span>
                <span className="text-sm font-bold text-[var(--color-text)] tracking-widest uppercase mt-1">{currentBreathePhase.label}</span>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRestart}
                className="w-12 h-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-card-border)] flex items-center justify-center text-[var(--color-subtle)] hover:text-[var(--color-text)] transition-colors focus:outline-none"
                aria-label="Restart breathing"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="w-16 h-16 rounded-full bg-[var(--color-lavender)] flex items-center justify-center text-[#0F172A] shadow-[0_4px_20px_rgba(199,210,254,0.4)] hover:scale-105 active:scale-95 transition-transform focus:outline-none"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-6 h-6 ml-1" /> : <Pause className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => setPhase('choose')}
                className="w-12 h-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-card-border)] flex items-center justify-center text-[var(--color-subtle)] hover:text-[var(--color-text)] transition-colors focus:outline-none"
                aria-label="Stop and exit"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Phase: Reframe */}
        {phase === 'reframe' && (
          <motion.div 
            key="reframe"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-8 space-y-6 relative z-10 text-center"
          >
            <div className="inline-flex bg-[var(--color-success)]/20 text-[var(--color-success)] p-3 rounded-full mb-2">
              <Wind className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--color-lavender)] mb-3">
                Reset Complete
              </p>
              <h3 className="text-2xl font-black text-[var(--color-text)] leading-tight italic px-4">
                &ldquo;{chosenReframe}&rdquo;
              </h3>
            </div>
            <button
              onClick={() => setPhase('action')}
              className="btn-primary w-full py-4 text-[#022C22] font-black rounded-xl text-base mt-4 shadow-lg focus:outline-none"
            >
              See One Next Action →
            </button>
          </motion.div>
        )}

        {/* Phase: Action */}
        {phase === 'action' && (
          <motion.div 
            key="action"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-5 relative z-10"
          >
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-teal)]">
              Choose one small step
            </p>
            <div className="space-y-3" role="list" aria-label="Suggested next actions">
              {RESET_NEXT_ACTIONS.map((action, i) => (
                <div
                  key={i}
                  role="listitem"
                  className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-bg)] shadow-sm hover:bg-[var(--color-card-hover)] transition-colors cursor-pointer"
                >
                  <span
                    className="w-6 h-6 rounded-full bg-[var(--color-lavender)]/20 text-[var(--color-lavender)] text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-[var(--color-muted)] font-medium leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setPhase('choose'); setCycleCount(0); }}
              className="w-full py-3 mt-2 rounded-xl text-sm font-bold text-[var(--color-subtle)] bg-[var(--color-bg)] border border-[var(--color-card-border)] hover:text-[var(--color-text)] hover:border-[var(--color-subtle)] transition-all focus:outline-none"
            >
              Start again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
