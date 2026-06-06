'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Activity, BrainCircuit, HeartPulse, Shield, Lock } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onSampleStudent: () => void;
}

export default function Hero({ onStart, onSampleStudent }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="hero-heading">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--color-teal)]/10 rounded-full blur-[80px]" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-[var(--color-lavender)]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Copy & CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              id="hero-heading"
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--color-text)] tracking-tight leading-tight"
            >
              Your exam stress reset, in <span className="gradient-text">90 seconds.</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-[var(--color-muted)] max-w-lg leading-relaxed font-medium"
            >
              Track mood, detect exam-stress loops, reflect safely, and get one calm next step for JEE, NEET, CUET, Boards and result season.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onStart}
              className="btn-primary w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold flex justify-center items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] whitespace-nowrap"
              aria-label="Start your 60-second check-in"
            >
              Start Check-In <span aria-hidden="true">→</span>
            </button>
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <button
                onClick={onSampleStudent}
                className="btn-secondary w-full px-8 py-4 rounded-xl text-lg font-bold flex justify-center items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
                aria-label="Load a sample heavy day scenario"
              >
                <Activity className="w-5 h-5" />
                Try Demo Student
              </button>
              <p className="text-[10px] sm:text-xs text-[var(--color-subtle)] font-medium mt-2 px-1">
                Loads a heavy JEE mock-test scenario.
              </p>
            </div>
          </motion.div>

          {/* Trust Pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-4">
            {[
              { icon: <Lock className="w-4 h-4 text-emerald-400" />, text: 'No login' },
              { icon: <ShieldCheck className="w-4 h-4 text-[var(--color-lavender)]" />, text: 'Local-only history' },
              { icon: <HeartPulse className="w-4 h-4 text-[var(--color-danger)]" />, text: 'Crisis-safe' },
              { icon: <BrainCircuit className="w-4 h-4 text-[var(--color-teal)]" />, text: 'Works without AI key' },
              { icon: <Shield className="w-4 h-4 text-[var(--color-amber)]" />, text: 'Built for exam stress' },
            ].map((pill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] bg-[var(--color-card)]/50 border border-[var(--color-card-border)] px-3 py-1.5 rounded-lg shadow-sm"
              >
                {pill.icon}
                {pill.text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side: 3D Floating Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
          className="relative hidden sm:block"
        >
          <motion.div
            animate={floatAnimation}
            className="relative z-10 glass-card p-6 rounded-3xl shadow-2xl border border-[var(--color-card-border)] bg-[var(--color-card)]/80 mx-auto max-w-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="bg-[var(--color-bg)] border border-[var(--color-card-border)] px-3 py-1 rounded-full text-xs font-bold text-[var(--color-lavender)] shadow-sm">
                Demo Preview
              </span>
              <span className="text-xs font-bold text-[var(--color-subtle)] bg-[var(--color-bg)] px-3 py-1 rounded-full shadow-inner">
                Heavy Day
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[var(--color-bg)] p-3 rounded-2xl border border-[var(--color-card-border)]">
                <p className="text-[10px] uppercase font-bold text-[var(--color-subtle)] mb-1">Stress</p>
                <p className="text-xl font-black text-[var(--color-danger)]">9<span className="text-sm font-medium text-[var(--color-subtle)]">/10</span></p>
              </div>
              <div className="bg-[var(--color-bg)] p-3 rounded-2xl border border-[var(--color-card-border)]">
                <p className="text-[10px] uppercase font-bold text-[var(--color-subtle)] mb-1">Sleep</p>
                <p className="text-xl font-black text-[var(--color-amber)]">4<span className="text-sm font-medium text-[var(--color-subtle)]">/10</span></p>
              </div>
              <div className="bg-[var(--color-bg)] p-3 rounded-2xl border border-[var(--color-card-border)]">
                <p className="text-[10px] uppercase font-bold text-[var(--color-subtle)] mb-1">Confidence</p>
                <p className="text-xl font-black text-[var(--color-lavender)]">3<span className="text-sm font-medium text-[var(--color-subtle)]">/10</span></p>
              </div>
            </div>

            {/* Loop */}
            <div className="bg-[var(--color-bg)] p-4 rounded-2xl border border-[var(--color-card-border)] mb-4">
              <p className="text-xs font-bold text-[var(--color-teal)] mb-2 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                Detected Exam Stress Loop
              </p>
              <p className="text-sm font-medium text-[var(--color-text)]">Score Rumination Loop</p>
            </div>

            {/* Action */}
            <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-card-border)] shadow-md">
              <p className="text-xs font-bold text-[var(--color-lavender)] mb-2">One Safe Next Step</p>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed font-medium">
                Review only 3 mock mistakes today.
              </p>
            </div>
            
            {/* Glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-teal)]/20 to-[var(--color-lavender)]/20 blur-xl z-[-1] rounded-[40px] opacity-50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
