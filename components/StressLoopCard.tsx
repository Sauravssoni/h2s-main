'use client';

import type { DetectedStressLoop } from '@/lib/types';
import { Activity, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface StressLoopCardProps {
  loop: DetectedStressLoop;
}

export default function StressLoopCard({ loop }: StressLoopCardProps) {
  // Parse chain into individual steps
  const chainSteps = loop.chain.split('→').map((s) => s.trim()).filter(Boolean);

  return (
    <section
      aria-labelledby="stress-loop-heading"
      className="rounded-3xl p-6 border border-[var(--color-card-border)] bg-[var(--color-card)] relative overflow-hidden shadow-2xl"
    >
      {/* Glow behind */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-danger)]/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-[var(--color-danger)]/20 p-2 rounded-xl">
          <Activity className="w-5 h-5 text-[var(--color-danger)]" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-danger)] mb-0.5">
            Detected Exam Stress Loop
          </p>
          <h3 id="stress-loop-heading" className="text-xl font-black text-[var(--color-text)]">
            {loop.name}
          </h3>
        </div>
      </div>

      {/* Chain visualization */}
      <div className="relative mb-8 mt-2 pl-4 border-l-2 border-[var(--color-card-border)] space-y-4" aria-label={`Stress chain: ${loop.chain}`}>
        {/* Animated glowing line running down the border */}
        <motion.div 
          className="absolute top-0 -left-[2px] w-[2px] bg-gradient-to-b from-[var(--color-danger)] via-[var(--color-amber)] to-transparent"
          initial={{ height: '0%' }}
          animate={{ height: '100%' }}
          transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        />

        {chainSteps.map((step, i) => (
          <motion.div 
            key={i} 
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            {/* Node dot */}
            <div className={`absolute -left-[21px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${i === 0 ? 'bg-[var(--color-danger)] shadow-[0_0_8px_var(--color-danger)]' : 'bg-[var(--color-card-border)]'}`} />
            
            <div className="bg-[var(--color-bg)] border border-[var(--color-card-border)] px-4 py-2.5 rounded-xl shadow-sm text-sm font-semibold text-[var(--color-text)] flex items-center justify-between">
              {step}
              {i < chainSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-[var(--color-subtle)] opacity-50" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Why detected */}
      <div className="flex items-start gap-2 pt-4 border-t border-[var(--color-card-border)]/50">
        <Zap className="w-4 h-4 text-[var(--color-amber)] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[var(--color-subtle)] font-medium leading-relaxed">
          <span className="text-[var(--color-muted)] font-bold">Why detected:</span> High stress combined with low confidence triggers this specific avoidance pattern. Breaking this cycle requires a very small, non-threatening step.
        </p>
      </div>
    </section>
  );
}
