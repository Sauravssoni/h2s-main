'use client';

import { useId } from 'react';

interface ChipGroupProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  emoji?: Record<T, string>;
  maxSelect?: number;
  description?: string;
}

export default function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
  emoji,
  maxSelect,
  description,
}: ChipGroupProps<T>) {
  const groupId = useId();
  const descId = description ? `${groupId}-desc` : undefined;

  function toggle(option: T) {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      if (maxSelect && selected.length >= maxSelect) return;
      onChange([...selected, option]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, option: T) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle(option);
    }
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-[#CBD5E1] mb-1">{label}</legend>
      {description && (
        <p id={descId} className="text-xs text-[#64748B] mb-3">
          {description}
        </p>
      )}
      <div className="flex flex-wrap gap-2" role="group" aria-describedby={descId}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                border-2 transition-all duration-200 cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-1 focus-visible:ring-offset-[#111827]
                ${
                  isSelected
                    ? 'bg-[#818CF8]/20 border-[#818CF8] text-[#C7D2FE]'
                    : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:border-[#818CF8]/50 hover:text-[#CBD5E1]'
                }
              `}
            >
              {emoji && (
                <span aria-hidden="true">{emoji[option]}</span>
              )}
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
