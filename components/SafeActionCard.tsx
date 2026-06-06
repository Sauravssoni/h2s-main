'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface SafeActionCardProps {
  actionText: string;
}

export default function SafeActionCard({ actionText }: SafeActionCardProps) {
  const [completed, setCompleted] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    setToastVisible(true);
    
    // Save completion locally (best effort, no critical failure if it fails)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('prepbuddy:v1:lastSafeActionCompleted', new Date().toISOString());
      }
    } catch {
      // localStorage unavailable
    }

    // Hide toast after 3 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <div className="relative">
      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-card-border)] p-6 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[var(--color-teal)]/10 to-[var(--color-lavender)]/10 blur-xl pointer-events-none z-0" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-[var(--color-lavender)]/20 text-[var(--color-lavender)] p-1.5 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-[var(--color-text)] tracking-tight">One Safe Next Step</h2>
          </div>
          
          <p className="text-[var(--color-muted)] font-medium leading-relaxed">
            {actionText}
          </p>
          
          {!completed ? (
            <button
              onClick={handleComplete}
              className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              I&apos;ll do this <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)] w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Completed
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute -bottom-14 left-0 right-0 mx-auto w-max bg-[var(--color-success)] text-[#022C22] px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 z-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Step saved. One safe step is enough for now.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
