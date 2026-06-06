'use client';

import type { WellnessSnapshot as WellnessSnapshotType } from '@/lib/types';
import { MOOD_EMOJI } from '@/lib/constants';
import MetricCard from './MetricCard';

const STATUS_CONFIG: Record<
  WellnessSnapshotType['status'],
  { color: string; bg: string; border: string; icon: string }
> = {
  Balanced: { color: '#34D399', bg: 'rgba(52, 211, 153, 0.08)', border: 'rgba(52, 211, 153, 0.25)', icon: '✅' },
  Watchful: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.25)', icon: '👁️' },
  'Heavy day': { color: '#F4A261', bg: 'rgba(244, 162, 97, 0.08)', border: 'rgba(244, 162, 97, 0.25)', icon: '⚡' },
  'Recovery needed': { color: '#F87171', bg: 'rgba(248, 113, 113, 0.08)', border: 'rgba(248, 113, 113, 0.25)', icon: '🔴' },
  'Support recommended': { color: '#F87171', bg: 'rgba(248, 113, 113, 0.08)', border: 'rgba(248, 113, 113, 0.25)', icon: '🆘' },
};

interface WellnessSnapshotProps {
  snapshot: WellnessSnapshotType;
}

export default function WellnessSnapshot({ snapshot }: WellnessSnapshotProps) {
  const config = STATUS_CONFIG[snapshot.status];

  return (
    <section aria-labelledby="snapshot-heading" className="space-y-4">
      <h2 id="snapshot-heading" className="text-base font-bold text-[#F8FAFC]">
        Wellness Snapshot
      </h2>

      {/* Status badge */}
      <div
        className="rounded-2xl p-5 border-2 flex items-start gap-4 animate-fade-in"
        style={{ backgroundColor: config.bg, borderColor: config.border }}
      >
        <span className="text-3xl flex-shrink-0" aria-hidden="true">
          {config.icon}
        </span>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold" style={{ color: config.color }}>
              {snapshot.status}
            </span>
            <span className="text-xl" aria-label={`Mood: ${snapshot.mood}`}>
              {MOOD_EMOJI[snapshot.mood]}
            </span>
          </div>
          <p className="text-sm text-[#CBD5E1] leading-relaxed">{snapshot.summary}</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Wellness metrics">
        <MetricCard
          label="Stress"
          value={snapshot.stressLevel}
          max={10}
          color={snapshot.stressLevel >= 7 ? '#F87171' : '#F59E0B'}
          icon="🔥"
        />
        <MetricCard
          label="Energy"
          value={snapshot.energyLevel}
          max={10}
          color={snapshot.energyLevel >= 6 ? '#34D399' : '#F59E0B'}
          icon="⚡"
        />
        <MetricCard
          label="Sleep"
          value={snapshot.sleepQuality}
          max={10}
          color={snapshot.sleepQuality >= 6 ? '#34D399' : '#F87171'}
          icon="😴"
        />
        <MetricCard
          label="Confidence"
          value={snapshot.confidenceLevel}
          max={10}
          color={snapshot.confidenceLevel >= 6 ? '#34D399' : '#F59E0B'}
          icon="💪"
        />
      </div>

      <p className="text-xs text-[#334155] italic">
        PrepBuddy is not a medical diagnosis tool. This snapshot reflects your self-reported check-in only.
      </p>
    </section>
  );
}
