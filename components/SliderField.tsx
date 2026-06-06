'use client';

import { useId } from 'react';

interface SliderFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  description?: string;
  lowLabel?: string;
  highLabel?: string;
}

export default function SliderField({
  label,
  name,
  value,
  onChange,
  min = 1,
  max = 10,
  description,
  lowLabel = 'Low',
  highLabel = 'High',
}: SliderFieldProps) {
  const id = useId();
  const descId = description ? `${id}-desc` : undefined;

  const pct = ((value - min) / (max - min)) * 100;
  const color =
    pct >= 80
      ? '#F87171'
      : pct >= 60
      ? '#F59E0B'
      : pct >= 40
      ? '#2DD4BF'
      : '#34D399';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-semibold text-[#CBD5E1]">
          {label}
        </label>
        <span
          className="text-lg font-bold tabular-nums"
          style={{ color }}
          aria-label={`${value} out of ${max}`}
        >
          {value}
        </span>
      </div>

      {description && (
        <p id={descId} className="text-xs text-[#64748B]">
          {description}
        </p>
      )}

      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={descId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, #1E293B ${pct}%)`,
        }}
      />

      <div className="flex justify-between text-xs text-[#475569]">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
