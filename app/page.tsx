'use client';

import { useState, useCallback } from 'react';
import type { StudentCheckInInput, WellnessPlan, JourneyEntry, JourneyStats, MascotName } from '@/lib/types';
import { generateId, todayISODate, SAMPLE_STUDENT_INPUT } from '@/lib/utils';
import {
  saveJourneyEntry,
  loadJourneyEntries,
  clearAllData,
  computeJourneyStats,
  loadProfile,
  saveProfile,
  getOrAssignMascot,
} from '@/lib/storage';
import { MASCOT_EMOJI } from '@/lib/constants';
import Hero from '@/components/Hero';
import CheckInForm from '@/components/CheckInForm';
import ResultsDashboard from '@/components/ResultsDashboard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import ChallengeAlignment from '@/components/ChallengeAlignment';
import WhyPrepBuddy from '@/components/WhyPrepBuddy';
import IsThisNormal from '@/components/IsThisNormal';
import ResetTool from '@/components/ResetTool';

type AppView = 'hero' | 'checkin' | 'loading' | 'results' | 'error' | 'reset';

export default function HomePage() {
  const [view, setView] = useState<AppView>('hero');
  const [currentPlan, setCurrentPlan] = useState<WellnessPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastCheckIn, setLastCheckIn] = useState<StudentCheckInInput | null>(null);
  const [journeyStats, setJourneyStats] = useState<JourneyStats>(() => {
    if (typeof window !== 'undefined') {
      return computeJourneyStats(loadJourneyEntries());
    }
    return computeJourneyStats([]);
  });
  const [initialFormValues, setInitialFormValues] = useState<
    Partial<StudentCheckInInput> | undefined
  >(undefined);

  // Mascot / profile
  const [mascotName] = useState<MascotName>(() => {
    if (typeof window !== 'undefined') {
      return getOrAssignMascot();
    }
    return 'Calm Tiger';
  });

  const handleStart = useCallback(() => {
    setInitialFormValues(undefined);
    setView('checkin');
  }, []);

  const handleSampleStudent = useCallback(() => {
    setInitialFormValues({ ...SAMPLE_STUDENT_INPUT, triggers: [...SAMPLE_STUDENT_INPUT.triggers] });
    setView('checkin');
  }, []);

  const handleOpenReset = useCallback(() => {
    setView('reset');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFormSubmit = useCallback(async (checkIn: StudentCheckInInput) => {
    setLastCheckIn(checkIn);
    setView('loading');

    // Save profile if first time
    if (typeof window !== 'undefined') {
      const existing = loadProfile();
      if (!existing) {
        saveProfile({
          mascotName,
          examType: checkIn.examType,
          createdAt: new Date().toISOString(),
        });
      }
    }

    try {
      const response = await fetch('/api/generate-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn }),
      });

      const data = await response.json() as
        | { success: true; plan: WellnessPlan }
        | { success: false; error: string };

      if (!data.success) {
        setErrorMessage(data.error ?? 'Something went wrong.');
        setView('error');
        return;
      }

      const plan = data.plan;
      setCurrentPlan(plan);

      // Save to journey
      const entry: JourneyEntry = {
        id: generateId(),
        date: todayISODate(),
        checkIn,
        plan,
        mascotName,
      };
      saveJourneyEntry(entry);
      const entries = loadJourneyEntries();
      setJourneyStats(computeJourneyStats(entries));

      setView('results');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    } catch {
      setErrorMessage(
        'Could not connect to the server. Please check your connection and try again.',
      );
      setView('error');
    }
  }, [mascotName]);

  const handleNewCheckIn = useCallback(() => {
    setCurrentPlan(null);
    setInitialFormValues(undefined);
    setView('checkin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearData = useCallback(() => {
    if (
      window.confirm(
        'This will delete all your PrepBuddy check-in history from this device. Are you sure?',
      )
    ) {
      clearAllData();
      setJourneyStats(computeJourneyStats([]));
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastCheckIn) {
      handleFormSubmit(lastCheckIn);
    } else {
      setView('checkin');
    }
  }, [lastCheckIn, handleFormSubmit]);

  const mascotEmoji = MASCOT_EMOJI[mascotName] ?? '🌟';

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#818CF8] focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Nav header */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setView('hero')}
            className="text-xl font-black hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] rounded"
            aria-label="PrepBuddy home"
          >
            <span className="gradient-text">PrepBuddy</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Mascot badge */}
            <span
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#475569] bg-[#111827] border border-[#1E293B] px-2.5 py-1 rounded-full"
              aria-label={`Your mascot: ${mascotName}`}
            >
              {mascotEmoji} {mascotName}
            </span>

            {view === 'hero' && (
              <>
                <button
                  onClick={handleOpenReset}
                  className="px-3 py-2 text-[#2DD4BF] text-sm font-semibold rounded-xl border border-[#2DD4BF]/30 hover:border-[#2DD4BF]/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
                  aria-label="90-second reset"
                >
                  ⏱ Reset
                </button>
                <button
                  onClick={handleStart}
                  className="px-4 py-2 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F172A]"
                  style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)' }}
                  aria-label="Start check-in"
                >
                  Start →
                </button>
              </>
            )}

            {view !== 'hero' && view !== 'checkin' && view !== 'reset' && (
              <button
                onClick={handleNewCheckIn}
                className="text-sm font-medium text-[#818CF8] hover:text-[#C7D2FE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] rounded px-2 py-1"
                aria-label="Start a new check-in"
              >
                New check-in
              </button>
            )}

            {(view === 'checkin' || view === 'reset') && (
              <button
                onClick={() => setView('hero')}
                className="text-sm text-[#475569] hover:text-[#64748B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] rounded px-2 py-1"
                aria-label="Return to home"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div id="main-content">
        {view === 'hero' && (
          <>
            <Hero onStart={handleStart} onSampleStudent={handleSampleStudent} onReset={handleOpenReset} />
            <ChallengeAlignment />
            <WhyPrepBuddy />
            <IsThisNormal />
          </>
        )}

        {view === 'reset' && (
          <div className="max-w-xl mx-auto px-4 py-8">
            <ResetTool onClose={() => setView('hero')} />
          </div>
        )}

        {view === 'checkin' && (
          <CheckInForm
            initialValues={initialFormValues}
            onSubmit={handleFormSubmit}
            isLoading={false}
          />
        )}

        {view === 'loading' && (
          <div className="max-w-xl mx-auto px-4 py-8">
            <LoadingState />
          </div>
        )}

        {view === 'error' && (
          <div className="max-w-xl mx-auto px-4 py-8">
            <ErrorState message={errorMessage} onRetry={handleRetry} />
          </div>
        )}

        {view === 'results' && currentPlan && (
          <ResultsDashboard
            plan={currentPlan}
            journeyStats={journeyStats}
            onNewCheckIn={handleNewCheckIn}
            onClearData={handleClearData}
          />
        )}
      </div>

      {/* Mobile bottom nav — shown on results/journey */}
      {(view === 'results' || view === 'hero') && (
        <nav
          className="fixed bottom-0 left-0 right-0 sm:hidden z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-[#1E293B] bottom-nav-safe"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around px-2 py-2">
            {[
            { icon: '📋', label: 'Check-In', action: handleStart, active: false },
              { icon: '⏱', label: 'Reset', action: handleOpenReset, active: false },
              { icon: '📈', label: 'Journey', action: view === 'results' ? () => {} : handleStart, active: view === 'results' },
            ].map(({ icon, label, action, active }) => (
              <button
                key={label}
                onClick={action}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8]"
                style={active ? { color: '#818CF8' } : { color: '#475569' }}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                <span className="text-xl" aria-hidden="true">{icon}</span>
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-[#334155] border-t border-[#1E293B] mt-8 mb-16 sm:mb-0">
        <p>
          PrepBuddy is not a diagnosis tool or therapy replacement.
          It offers everyday exam wellness support and encourages reaching out to trusted people when needed.
        </p>
        <p className="mt-1">
          Your check-ins stay on this device only. · Built for Hack2Skill PromptWars 2025
        </p>
      </footer>
    </div>
  );
}
