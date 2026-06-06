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
      ? '#C97A7E'
      : pct >= 60
      ? '#D4A373'
      : pct >= 40
      ? '#7A9E9F'
      : '#729C7C';

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
        <p id={descId} className="text-xs text-[#A8A29E]">
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
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF]"
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, #EAE5DF ${pct}%)`,
        }}
      />

      <div className="flex justify-between text-xs text-[#D6D1CB]">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
