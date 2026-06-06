'use client';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 gap-5"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-16 h-16 rounded-full bg-[#F87171]/10 flex items-center justify-center border border-[#F87171]/20">
        <span className="text-3xl" aria-hidden="true">⚠️</span>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold text-[#F8FAFC]">Something went wrong</h2>
        <p className="text-sm text-[#64748B] max-w-sm">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 text-white rounded-xl font-medium hover:opacity-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
          style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)' }}
          aria-label="Try again"
        >
          Try again
        </button>
      )}

      <p className="text-xs text-[#334155] text-center max-w-xs">
        Your check-in data was not sent to any server. Please try again.
      </p>
    </div>
  );
}
