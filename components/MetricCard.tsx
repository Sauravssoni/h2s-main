'use client';

interface MetricCardProps {
  label: string;
  value: number | string;
  max?: number;
  color?: string;
  icon?: string;
  description?: string;
}

export default function MetricCard({
  label,
  value,
  max,
  color = '#818CF8',
  icon,
  description,
}: MetricCardProps) {
  const numericValue = typeof value === 'number' ? value : null;
  const pct =
    numericValue !== null && max
      ? Math.round(((numericValue - 1) / (max - 1)) * 100)
      : null;

  return (
    <div className="bg-[#111827] rounded-2xl p-4 border border-[#1E293B] card-hover">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span aria-hidden="true" className="text-xl">{icon}</span>}
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
            {label}
          </span>
        </div>
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color }}
          aria-label={`${label}: ${value}${max ? ` out of ${max}` : ''}`}
        >
          {value}
        </span>
      </div>

      {pct !== null && max && (
        <div
          className="h-1.5 rounded-full bg-[#1E293B] overflow-hidden"
          role="progressbar"
          aria-valuenow={numericValue ?? 0}
          aria-valuemin={1}
          aria-valuemax={max}
          aria-label={`${label} progress`}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      )}

      {description && (
        <p className="mt-2 text-xs text-[#64748B]">{description}</p>
      )}
    </div>
  );
}
