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
import WhyPrepBuddy from '@/components/WhyPrepBuddy';
import IsThisNormal from '@/components/IsThisNormal';
import ResetTool from '@/components/ResetTool';
import SafeActionCard from '@/components/SafeActionCard';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSampleStudent = useCallback(() => {
    // Inject exact requested demo state
    setInitialFormValues({ 
      examType: 'JEE',
      examPhase: 'Mock Test Week',
      mood: 'Anxious',
      stressLevel: 9,
      anxietyLevel: 8,
      energyLevel: 4,
      sleepQuality: 4,
      focusLevel: 5,
      confidenceLevel: 3,
      triggers: ['Mock test score', 'Syllabus backlog'],
      reflection: "I feel like everyone is ahead of me. My mock score dropped again and I feel like I wasted my parents’ money."
    });
    setView('checkin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenReset = useCallback(() => {
    setView('reset');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFormSubmit = useCallback(async (checkIn: StudentCheckInInput) => {
    setLastCheckIn(checkIn);
    setView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

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
    <div className="min-h-screen bg-transparent text-[var(--color-text)] pb-20 sm:pb-0">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-indigo)] focus:text-[var(--color-text)] focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Nav header */}
      <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-card-border)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setView('hero')}
            className="text-2xl font-black tracking-tight hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] rounded"
            aria-label="PrepBuddy home"
          >
            <span className="gradient-text">PrepBuddy</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Mascot badge */}
            <span
              className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--color-subtle)] bg-[var(--color-card)] border border-[var(--color-card-border)] px-3 py-1.5 rounded-full shadow-sm"
              aria-label={`Your mascot: ${mascotName}`}
            >
              {mascotEmoji} {mascotName}
            </span>

            {view === 'hero' && (
              <>
                <button
                  onClick={handleOpenReset}
                  className="hidden sm:inline-flex px-4 py-2 text-[var(--color-lavender)] text-sm font-semibold rounded-xl btn-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)]"
                  aria-label="90-second reset"
                >
                  ⏱ Quick Reset
                </button>
                <button
                  onClick={handleStart}
                  className="px-5 py-2 text-sm font-bold rounded-xl btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                  aria-label="Start check-in"
                >
                  Check-In →
                </button>
              </>
            )}

            {view !== 'hero' && view !== 'checkin' && view !== 'reset' && (
              <button
                onClick={handleNewCheckIn}
                className="text-sm font-semibold text-[var(--color-lavender)] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] rounded px-3 py-1.5"
                aria-label="Start a new check-in"
              >
                New check-in
              </button>
            )}

            {(view === 'checkin' || view === 'reset') && (
              <button
                onClick={() => setView('hero')}
                className="text-sm font-medium text-[var(--color-subtle)] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] rounded px-3 py-1.5"
                aria-label="Return to home"
              >
                ← Cancel
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
            <WhyPrepBuddy />
            <IsThisNormal />
          </>
        )}

        {view === 'reset' && (
          <div className="max-w-2xl mx-auto px-4 py-12">
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
          <div className="max-w-xl mx-auto px-4 py-12">
            <LoadingState />
          </div>
        )}

        {view === 'error' && (
          <div className="max-w-xl mx-auto px-4 py-12">
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

      {/* Mobile bottom nav — shown on results/hero */}
      {(view === 'results' || view === 'hero') && (
        <nav
          className="fixed bottom-0 left-0 right-0 sm:hidden z-40 bg-[var(--color-bg)]/90 backdrop-blur-xl border-t border-[var(--color-card-border)] bottom-nav-safe"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around px-2 py-3">
            {[
              { icon: '📝', label: 'Check-In', action: handleStart, active: false },
              { icon: '⏱', label: 'Reset', action: handleOpenReset, active: false },
              { icon: '📈', label: 'Journey', action: view === 'results' ? () => {} : handleStart, active: view === 'results' },
            ].map(({ icon, label, action, active }) => (
              <button
                key={label}
                onClick={action}
                className="flex flex-col items-center gap-1.5 px-4 py-1 rounded-xl transition-colors focus:outline-none"
                style={active ? { color: 'var(--color-lavender)' } : { color: 'var(--color-subtle)' }}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                <span className="text-2xl drop-shadow-md" aria-hidden="true">{icon}</span>
                <span className="text-[10px] font-bold tracking-wide uppercase">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Footer */}
      <footer className="text-center py-10 text-xs font-medium text-[var(--color-subtle)] border-t border-[var(--color-card-border)] mt-12 bg-[var(--color-bg)]">
        <p className="max-w-xl mx-auto px-6 leading-relaxed">
          PrepBuddy is not a diagnosis tool or therapy replacement.
          It offers everyday exam wellness support and encourages reaching out to trusted people when needed.
        </p>
        <p className="mt-3 opacity-70">
          Your check-ins stay on this device only. Private by design.
        </p>
      </footer>
    </div>
  );
}
