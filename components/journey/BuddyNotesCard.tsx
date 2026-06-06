'use client';

import { useState } from 'react';
import type { BuddyNote } from '@/lib/types';
import { useToast } from '@/lib/useToast';

interface BuddyNotesCardProps {
  notes: BuddyNote[];
  onRefresh?: () => void;
}

export default function BuddyNotesCard({ notes, onRefresh }: BuddyNotesCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();

  if (!notes || notes.length === 0) return null;

  const handleCopy = async (note: BuddyNote) => {
    try {
      await navigator.clipboard.writeText(note.text);
      setCopiedId(note.id);
      showToast('Note copied!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard unavailable — fallback
      const textarea = document.createElement('textarea');
      textarea.value = note.text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedId(note.id);
        showToast('Note copied!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
      } catch {
        showToast('Could not copy', 'error');
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div
      className="bg-[var(--color-card)] rounded-2xl p-5 border border-[var(--color-card-border)] shadow-sm"
      role="region"
      aria-label="Buddy notes for today"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
          <span aria-hidden="true">💬</span>
          Buddy Notes for Today
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-xs font-medium text-[var(--color-subtle)] hover:text-[var(--color-text)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] rounded px-2 py-1"
            aria-label="Refresh buddy notes"
          >
            ↻ Refresh
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {notes.slice(0, 3).map((note) => (
          <div
            key={note.id}
            className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-card-border)] flex items-start justify-between gap-3"
          >
            <p className="text-sm text-[var(--color-text)] leading-relaxed font-medium flex-1">
              &ldquo;{note.text}&rdquo;
            </p>
            <button
              onClick={() => handleCopy(note)}
              className="flex-shrink-0 text-xs font-medium text-[var(--color-subtle)] hover:text-[var(--color-teal)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] rounded px-2 py-1"
              aria-label={`Copy note: ${note.text}`}
            >
              {copiedId === note.id ? '✓' : '📋'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
