'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { WellnessPlan, JourneyStats } from '@/lib/types';
import TriggerMap from './TriggerMap';
import SafetySupportCard from './SafetySupportCard';
import JourneyDashboard from './JourneyDashboard';
import StressLoopCard from './StressLoopCard';
import EvidenceMode from './EvidenceMode';
import SupportResources from './SupportResources';
import ResetTool from './ResetTool';
import SafeActionCard from './SafeActionCard';
import ExamTimelineCard from './journey/ExamTimelineCard';
import BuddyNotesCard from './journey/BuddyNotesCard';

interface ResultsDashboardProps {
  plan: WellnessPlan;
  journeyStats: JourneyStats;
  onNewCheckIn: () => void;
  onClearData: () => void;
}

export default function ResultsDashboard({
  plan,
  journeyStats,
  onNewCheckIn,
  onClearData,
}: ResultsDashboardProps) {
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

  // Determine status
  const isHeavy = plan.snapshot.stressLevel >= 7 || plan.snapshot.energyLevel <= 3;
  const statusBadge = isHeavy ? 'Heavy Day' : 'Balanced';
  const heroText = isHeavy 
    ? 'Today feels heavy — let’s make the next step small.' 
    : 'You are maintaining momentum. Stay steady.';
  
  // Safe action step
  const safeAction = plan.detectedStressLoop?.action || plan.studyRecoveryPlan?.recoveryAction || plan.resetSteps[0]?.action || 'Take a 5 minute break to step away from your desk.';

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6" id="results-main">
      {/* Header Command Center */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 bg-[var(--color-bg)] border border-[var(--color-card-border)] px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
          <span className={isHeavy ? "text-[var(--color-danger)]" : "text-[var(--color-success)]"}>
            {statusBadge}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tracking-tight">
          {heroText}
        </h1>
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-[var(--color-card)] p-3 rounded-2xl border border-[var(--color-card-border)] shadow-sm">
            <p className="text-[10px] uppercase font-bold text-[var(--color-subtle)] mb-1">Stress</p>
            <p className={`text-xl font-black ${plan.snapshot.stressLevel >= 7 ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}>
              {plan.snapshot.stressLevel}<span className="text-xs font-bold text-[var(--color-subtle)]">/10</span>
            </p>
          </div>
          <div className="bg-[var(--color-card)] p-3 rounded-2xl border border-[var(--color-card-border)] shadow-sm">
            <p className="text-[10px] uppercase font-bold text-[var(--color-subtle)] mb-1">Energy</p>
            <p className={`text-xl font-black ${plan.snapshot.energyLevel <= 3 ? 'text-[var(--color-amber)]' : 'text-[var(--color-success)]'}`}>
              {plan.snapshot.energyLevel}<span className="text-xs font-bold text-[var(--color-subtle)]">/10</span>
            </p>
          </div>
          <div className="bg-[var(--color-card)] p-3 rounded-2xl border border-[var(--color-card-border)] shadow-sm">
            <p className="text-[10px] uppercase font-bold text-[var(--color-subtle)] mb-1">Sleep</p>
            <p className={`text-xl font-black ${plan.snapshot.sleepQuality <= 4 ? 'text-[var(--color-amber)]' : 'text-[var(--color-success)]'}`}>
              {plan.snapshot.sleepQuality}<span className="text-xs font-bold text-[var(--color-subtle)]">/10</span>
            </p>
          </div>
          <div className="bg-[var(--color-card)] p-3 rounded-2xl border border-[var(--color-card-border)] shadow-sm">
            <p className="text-[10px] uppercase font-bold text-[var(--color-subtle)] mb-1">Confidence</p>
            <p className={`text-xl font-black ${plan.snapshot.confidenceLevel <= 4 ? 'text-[var(--color-lavender)]' : 'text-[var(--color-success)]'}`}>
              {plan.snapshot.confidenceLevel}<span className="text-xs font-bold text-[var(--color-subtle)]">/10</span>
            </p>
          </div>
        </div>
      </motion.header>

      {/* Crisis card shown at top — always */}
      {plan.safetySupport.level === 'crisis' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <SafetySupportCard support={plan.safetySupport} />
        </motion.div>
      )}

      {/* Panic-to-Plan — elevated */}
      {plan.safetySupport.level === 'elevated' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <SafetySupportCard support={plan.safetySupport} />
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 pt-4"
        aria-live="polite"
        aria-label="Your personalised wellness plan"
      >
        {plan.safetySupport.level === 'crisis' ? (
          <motion.div variants={itemVariants} className="pt-6">
            <SupportResources showAll={true} />
          </motion.div>
        ) : (
          <>
            {/* 1. Stress loop card */}
            {plan.detectedStressLoop && (
              <motion.div variants={itemVariants} className="card-hover rounded-2xl">
                <StressLoopCard loop={plan.detectedStressLoop} />
              </motion.div>
            )}

            {/* 2. Safe Action Card */}
            <motion.div variants={itemVariants}>
              <SafeActionCard actionText={safeAction} />
            </motion.div>

            {/* 3. Reset Tool */}
            <motion.div variants={itemVariants} className="card-hover rounded-3xl overflow-hidden border border-[var(--color-card-border)] bg-[var(--color-card)]">
              <ResetTool />
            </motion.div>

            {/* 4. Evidence mode toggle */}
            <motion.div variants={itemVariants} className="pt-4 border-t border-[var(--color-card-border)]">
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="text-xs font-medium text-[var(--color-subtle)] hover:text-[var(--color-text)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] rounded px-2 py-1"
                aria-expanded={showEvidence}
              >
                {showEvidence ? '▲ Hide engine evidence' : '▼ Why was this plan generated?'}
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

            {/* Other context cards: Trigger Map & Reflection */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-hover rounded-2xl h-full">
                <TriggerMap analysis={plan.triggerAnalysis} />
              </div>
              <div className="bg-[var(--color-card)] rounded-2xl p-5 border border-[var(--color-card-border)] shadow-sm card-hover flex flex-col justify-center">
                <h2 className="text-sm font-bold text-[var(--color-text)] mb-3">Reflection Insight</h2>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed italic">
                  &ldquo;{plan.reflectionInsight}&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Exam Timeline */}
            {plan.examTimeline && plan.examTimeline.daysLeft !== null && (
              <motion.div variants={itemVariants} className="card-hover rounded-2xl">
                <ExamTimelineCard timeline={plan.examTimeline} />
              </motion.div>
            )}

            {/* Buddy Notes */}
            {plan.buddyNotes && plan.buddyNotes.length > 0 && (
              <motion.div variants={itemVariants} className="card-hover rounded-2xl">
                <BuddyNotesCard notes={plan.buddyNotes} />
              </motion.div>
            )}

            {/* Journey dashboard */}
            <motion.div variants={itemVariants} className="card-hover rounded-2xl">
              <JourneyDashboard stats={journeyStats} onClearData={onClearData} />
            </motion.div>

            {/* Support resources */}
            <motion.div variants={itemVariants}>
              <SupportResources showAll={false} />
            </motion.div>
          </>
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewCheckIn}
          className="btn-primary px-10 py-4 rounded-2xl font-bold w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
          aria-label="Start a new wellness check-in"
        >
          Check-In Again →
        </motion.button>
        <p className="text-xs font-medium text-[var(--color-subtle)] mt-4">
          Come back tomorrow to track your academic journey.
        </p>
      </motion.div>
    </main>
  );
}
