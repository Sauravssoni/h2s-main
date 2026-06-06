'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { WellnessPlan, JourneyStats } from '@/lib/types';
import WellnessSnapshot from './WellnessSnapshot';
import TriggerMap from './TriggerMap';
import ResetPlan from './ResetPlan';
import StudyRecoveryPlan from './StudyRecoveryPlan';
import SafetySupportCard from './SafetySupportCard';
import JourneyDashboard from './JourneyDashboard';
import StressLoopCard from './StressLoopCard';
import EvidenceMode from './EvidenceMode';
import SupportResources from './SupportResources';
import ResetTool from './ResetTool';

interface ResultsDashboardProps {
  plan: WellnessPlan;
  journeyStats: JourneyStats;
  onNewCheckIn: () => void;
  onClearData: () => void;
  examType?: WellnessPlan['safetySupport']['resources'][0]['showFor'] extends Array<infer T> ? T : never;
}

export default function ResultsDashboard({
  plan,
  journeyStats,
  onNewCheckIn,
  onClearData,
}: ResultsDashboardProps) {
  const [showReset, setShowReset] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6" id="results-main">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#EAE5DF] text-[#8C7A6B] px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
          <span aria-hidden="true">✅</span>
          Check-in complete
        </div>
        <h1 className="text-3xl font-bold text-[#1C1917] tracking-tight">
          Your Wellness Plan
        </h1>
        <p className="text-sm text-[#A8A29E]">
          Based on your check-in ·{' '}
          {new Date(plan.generatedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </motion.header>

      {/* Crisis card shown at top — always */}
      {plan.safetySupport.level === 'crisis' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <SafetySupportCard support={plan.safetySupport} onOpenReset={() => setShowReset(true)} />
        </motion.div>
      )}

      {/* Panic-to-Plan — elevated */}
      {plan.safetySupport.level === 'elevated' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <SafetySupportCard support={plan.safetySupport} onOpenReset={() => setShowReset(true)} />
        </motion.div>
      )}

      {/* 90-second reset */}
      {showReset && (
        <ResetTool onClose={() => setShowReset(false)} />
      )}

      {/* Inline reset CTA if high stress and not already shown */}
      {!showReset && plan.snapshot.stressLevel >= 7 && plan.safetySupport.level === 'normal' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowReset(true)}
          className="w-full py-3 rounded-2xl text-sm font-semibold text-[#7A9E9F] bg-[#FFFFFF] border border-[#7A9E9F]/30 shadow-sm hover:border-[#7A9E9F]/60 hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9E9F]"
          aria-label="Open 90-second exam stress reset"
        >
          ⏱ Try the 90-Second Reset
        </motion.button>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
        aria-live="polite"
        aria-label="Your personalised wellness plan"
      >
        {/* Snapshot */}
        <motion.div variants={itemVariants} className="card-hover">
          <WellnessSnapshot snapshot={plan.snapshot} />
        </motion.div>

        {/* Stress loop card */}
        {plan.detectedStressLoop && (
          <motion.div variants={itemVariants} className="card-hover">
            <StressLoopCard loop={plan.detectedStressLoop} />
          </motion.div>
        )}

        {/* Trigger map */}
        <motion.div variants={itemVariants} className="card-hover">
          <TriggerMap analysis={plan.triggerAnalysis} />
        </motion.div>

        {/* Pain points */}
        {plan.detectedPainPoints.length > 0 && (
          <motion.section variants={itemVariants} aria-labelledby="pain-points-heading" className="space-y-3">
            <h2 id="pain-points-heading" className="text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span aria-hidden="true">🔍</span> Detected Patterns
            </h2>
            <div className="space-y-2">
              {plan.detectedPainPoints.slice(0, 3).map((pp) => (
                <div
                  key={pp.id}
                  className="p-4 rounded-xl border border-[#EAE5DF] bg-[#FFFFFF] shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <p className="text-sm text-[#78716C] leading-relaxed font-medium">{pp.message}</p>
                  <div className="flex items-start gap-2 mt-2">
                    <span className="text-[#8C7A6B] text-xs font-bold flex-shrink-0" aria-hidden="true">→</span>
                    <p className="text-xs text-[#8C7A6B] font-bold tracking-wide">{pp.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Reset plan */}
        <motion.div variants={itemVariants} className="card-hover">
          <ResetPlan steps={plan.resetSteps} />
        </motion.div>

        {/* Study + recovery plan */}
        <motion.div variants={itemVariants} className="card-hover">
          <StudyRecoveryPlan
            plan={plan.studyRecoveryPlan}
            examPhaseProtocol={plan.examPhaseProtocol}
          />
        </motion.div>

        {/* Reflection insight */}
        <motion.section variants={itemVariants} aria-labelledby="reflection-heading" className="space-y-3 card-hover">
          <h2 id="reflection-heading" className="text-base font-bold text-[#1C1917]">
            Reflection Insight
          </h2>
          <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#EAE5DF] shadow-sm">
            <p className="text-sm text-[#78716C] leading-relaxed italic">
              &ldquo;{plan.reflectionInsight}&rdquo;
            </p>
          </div>
        </motion.section>

        {/* Calm exercise */}
        <motion.section variants={itemVariants} aria-labelledby="calm-heading" className="space-y-3 card-hover">
          <h2 id="calm-heading" className="text-base font-bold text-[#1C1917]">
            {plan.calmExercise.name}
          </h2>
          <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#EAE5DF] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#A8A29E] font-medium">{plan.calmExercise.description}</p>
              <span className="text-xs font-bold text-[#8C7A6B] bg-[#8C7A6B]/10 px-3 py-1 rounded-full flex-shrink-0 ml-2 shadow-inner">
                {plan.calmExercise.duration}
              </span>
            </div>
            <ol className="space-y-2 pt-2" aria-label={`${plan.calmExercise.name} steps`}>
              {plan.calmExercise.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#78716C]">
                  <span
                    className="w-6 h-6 rounded-full bg-[#8C7A6B] text-[#FDFBF7] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.section>

        {/* Evidence mode toggle */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-xs font-medium text-[#D6D1CB] hover:text-[#A8A29E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] rounded px-2 py-1"
            aria-expanded={showEvidence}
          >
            {showEvidence ? '▲ Hide engine evidence' : '▼ View AI engine evidence'}
          </button>
          {showEvidence && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 overflow-hidden"
            >
              <EvidenceMode evidenceItems={plan.evidenceItems} />
            </motion.div>
          )}
        </motion.div>

        {/* Journey dashboard */}
        <motion.div variants={itemVariants} className="card-hover">
          <JourneyDashboard stats={journeyStats} onClearData={onClearData} />
        </motion.div>

        {/* Support resources */}
        <motion.div variants={itemVariants}>
          <SupportResources showAll={false} />
        </motion.div>

        {/* Normal support card */}
        {plan.safetySupport.level === 'normal' && (
          <motion.div variants={itemVariants} className="card-hover">
            <SafetySupportCard support={plan.safetySupport} onOpenReset={() => setShowReset(true)} />
          </motion.div>
        )}
      </motion.div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center pt-8 pb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewCheckIn}
          className="px-10 py-4 text-white rounded-2xl font-bold shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
          style={{ background: 'linear-gradient(135deg, #8C7A6B, #7A6A5C)' }}
          aria-label="Start a new wellness check-in"
        >
          New Check-In →
        </motion.button>
        <p className="text-xs font-medium text-[#A8A29E] mt-4">
          Come back tomorrow to track your academic journey.
        </p>
      </motion.div>
    </main>
  );
}
