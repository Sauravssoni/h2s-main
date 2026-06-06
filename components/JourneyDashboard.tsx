'use client';

import type { JourneyStats, MoodLabel } from '@/lib/types';
import { MOOD_EMOJI } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

const MOOD_STRESS_COLOR: Record<string, string> = {
  Calm: '#729C7C',
  Okay: '#7A9E9F',
  Stressed: '#F4A261',
  Anxious: '#D4A373',
  Low: '#C97A7E',
  Overwhelmed: '#EF4444',
};

interface JourneyDashboardProps {
  stats: JourneyStats;
  onClearData: () => void;
}

export default function JourneyDashboard({ stats, onClearData }: JourneyDashboardProps) {
  const hasTrend = stats.moodTrend.length > 1;

  return (
    <section aria-labelledby="journey-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="journey-heading" className="text-base font-bold text-[#1C1917]">
          Your Academic Journey
        </h2>
        <span className="inline-flex items-center gap-1 bg-[#8C7A6B]/10 text-[#8C7A6B] text-xs font-bold px-3 py-1 rounded-full border border-[#8C7A6B]/20">
          🔥 {stats.streak}-day streak
        </span>
      </div>

      {stats.totalCheckIns === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl p-6 text-center border border-[#EAE5DF]">
          <p className="text-4xl mb-2" aria-hidden="true">📊</p>
          <p className="text-sm text-[#A8A29E]">
            Complete your first check-in to see your journey trends here.
          </p>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Check-ins', value: stats.totalCheckIns, icon: '📋', unit: '' },
              { label: 'Avg Stress', value: stats.averageStress, icon: '🔥', unit: '/10' },
              { label: 'Avg Sleep', value: stats.averageSleep, icon: '😴', unit: '/10' },
              { label: 'Avg Confidence', value: stats.averageConfidence, icon: '💪', unit: '/10' },
            ].map(({ label, value, icon, unit }) => (
              <div
                key={label}
                className="bg-[#FFFFFF] rounded-2xl p-3 border border-[#EAE5DF] text-center"
              >
                <p className="text-xl" aria-hidden="true">{icon}</p>
                <p className="text-xl font-bold text-[#1C1917] tabular-nums">
                  {value}{unit}
                </p>
                <p className="text-xs text-[#A8A29E]">{label}</p>
              </div>
            ))}
          </div>

          {/* Mood trend chart (SVG-based) */}
          {hasTrend && (
            <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#EAE5DF]">
              <p className="text-sm font-semibold text-[#1C1917] mb-3">
                Mood &amp; Stress Trend
              </p>
              <div
                className="flex items-end gap-2 h-20"
                role="img"
                aria-label={`Mood trend over ${stats.moodTrend.length} days`}
              >
                {[...stats.moodTrend].reverse().map((entry, i) => {
                  const heightPct = Math.round((entry.stress / 10) * 100);
                  const color = MOOD_STRESS_COLOR[entry.mood] ?? '#8C7A6B';
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 flex-1"
                      title={`${formatDate(entry.date)}: ${entry.mood}, Stress ${entry.stress}`}
                    >
                      <span className="text-xs" aria-hidden="true">
                        {MOOD_EMOJI[entry.mood as MoodLabel]}
                      </span>
                      <div className="w-full flex items-end justify-center" style={{ height: '48px' }}>
                        <div
                          className="w-full rounded-t-sm transition-all duration-500"
                          style={{ height: `${heightPct}%`, backgroundColor: color, minHeight: '4px', opacity: 0.75 }}
                        />
                      </div>
                      <span className="text-xs text-[#D6D1CB] tabular-nums">
                        {new Date(entry.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'numeric',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-[#D6D1CB] mt-1">Bar height = stress level</p>
            </div>
          )}

          {/* Most common triggers */}
          {stats.mostCommonTriggers.length > 0 && (
            <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#EAE5DF]">
              <p className="text-sm font-semibold text-[#1C1917] mb-2">
                Most Common Triggers
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.mostCommonTriggers.map((trigger) => (
                  <span
                    key={trigger}
                    className="text-xs bg-[#EAE5DF] text-[#78716C] border border-[#D6D1CB] px-3 py-1 rounded-full"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Improvement note */}
          {stats.improvementNote && (
            <div
              className="rounded-2xl p-4 border"
              style={{ background: 'rgba(52, 211, 153, 0.06)', borderColor: 'rgba(52, 211, 153, 0.2)' }}
            >
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                💡 {stats.improvementNote}
              </p>
            </div>
          )}

          {/* Clear data */}
          <div className="text-center pt-1">
            <button
              onClick={onClearData}
              className="text-xs text-[#D6D1CB] hover:text-[#C97A7E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C97A7E] rounded"
              aria-label="Clear all my check-in history from this device"
            >
              Clear my check-in history from this device
            </button>
          </div>
        </>
      )}

      <p className="text-xs text-[#D6D1CB] text-center">
        Your check-ins are stored only on this device. PrepBuddy does not store your data on a server.
      </p>
    </section>
  );
}
