'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Target, Activity, Lock, ArrowRight, Timer, UserCircle2 } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onSampleStudent: () => void;
  onReset: () => void;
}

const DIFFERENTIATORS = [
  { icon: <Target className="w-5 h-5 text-[#8C7A6B]" />, text: 'Built for exam stress, not generic wellness' },
  { icon: <Activity className="w-5 h-5 text-[#8C7A6B]" />, text: 'Detects stress loops, not just mood' },
  { icon: <ShieldCheck className="w-5 h-5 text-[#8C7A6B]" />, text: 'Gives one safe next action, not long advice' },
  { icon: <Lock className="w-5 h-5 text-[#8C7A6B]" />, text: 'Stores check-ins locally, not on a server' },
];

export default function Hero({ onStart, onSampleStudent, onReset }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      {/* Background blobs */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8C7A6B 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7A9E9F 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto relative z-10 space-y-8"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#EAE5DF] px-4 py-2 rounded-full text-sm font-medium text-[#78716C] shadow-sm">
          <span aria-hidden="true">🎓</span>
          For JEE · NEET · CUET · CAT · GATE · UPSC · Board Exams
        </motion.div>

        {/* Logo + Name */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
            <span className="gradient-text drop-shadow-sm">PrepBuddy</span>
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-[#78716C]">
            Your exam stress reset, in <span className="text-[#8C7A6B]">90 seconds.</span>
          </p>
        </motion.div>

        {/* Core line */}
        <motion.p variants={itemVariants} className="text-base sm:text-lg text-[#78716C] leading-relaxed max-w-xl mx-auto">
          PrepBuddy does not just ask how you feel. It identifies{' '}
          <strong className="text-[#1C1917]">what exam-stress loop you are stuck in</strong>{' '}
          and gives one safe next action.
        </motion.p>

        {/* Feature pills */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2" aria-label="Key features">
          {[
            '📊 Track Mood',
            '🧩 Identify Triggers',
            '💭 Reflect Safely',
            '✨ Personalized Support',
            '📈 Academic Journey',
            '🔒 Private & Local',
          ].map((feature) => (
            <motion.span
              whileHover={{ scale: 1.05 }}
              key={feature}
              className="inline-flex items-center gap-1 bg-[#FFFFFF] border border-[#EAE5DF] text-[#78716C] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm cursor-default"
            >
              {feature}
            </motion.span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] transition-all"
            style={{ background: 'linear-gradient(135deg, #8C7A6B, #7A6A5C)' }}
            aria-label="Start your 60-second wellness check-in"
            id="start-checkin-btn"
          >
            Start Check-In
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-[#FFFFFF] text-[#7A9E9F] text-base font-semibold rounded-2xl border border-[#EAE5DF] shadow-sm hover:border-[#7A9E9F]/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9E9F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
            aria-label="Try the 90-second exam stress reset"
            id="start-reset-btn"
          >
            <Timer className="w-5 h-5" />
            90-Sec Reset
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSampleStudent}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-transparent text-[#78716C] text-sm font-medium rounded-2xl border border-[#EAE5DF] hover:bg-[#FFFFFF] hover:text-[#1C1917] hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
            aria-label="Try sample student demo — JEE Mock Test Week"
            id="try-sample-btn"
          >
            <UserCircle2 className="w-5 h-5" />
            Try Demo
          </motion.button>
        </motion.div>

        {/* Privacy note */}
        <motion.p variants={itemVariants} className="text-xs text-[#A8A29E] pt-2">
          <ShieldCheck className="inline-block w-4 h-4 mr-1 mb-0.5" />
          Your check-ins stay on this device. PrepBuddy does not store your journal on a server.
        </motion.p>
      </motion.div>

      {/* Why PrepBuddy is different */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mt-20 w-full max-w-2xl mx-auto relative z-10"
        aria-labelledby="differentiator-heading"
      >
        <h2 id="differentiator-heading" className="text-sm tracking-widest uppercase font-bold text-[#A8A29E] mb-6 text-center">
          Why PrepBuddy is different
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIFFERENTIATORS.map(({ icon, text }, i) => (
            <motion.div
              whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(140, 122, 107, 0.1)' }}
              key={i}
              className="flex items-center gap-4 bg-[#FFFFFF] border border-[#EAE5DF] shadow-sm rounded-xl px-5 py-4 transition-all"
            >
              <div className="flex-shrink-0 bg-[#FDFBF7] p-2 rounded-lg border border-[#EAE5DF]" aria-hidden="true">{icon}</div>
              <p className="text-sm font-medium text-[#78716C] text-left">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
