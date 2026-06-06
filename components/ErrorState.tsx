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
      <div className="w-16 h-16 rounded-full bg-[#C97A7E]/10 flex items-center justify-center border border-[#C97A7E]/20">
        <span className="text-3xl" aria-hidden="true">⚠️</span>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold text-[#1C1917]">Something went wrong</h2>
        <p className="text-sm text-[#A8A29E] max-w-sm">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 text-white rounded-xl font-medium hover:opacity-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
          style={{ background: 'linear-gradient(135deg, #8C7A6B, #7A6A5C)' }}
          aria-label="Try again"
        >
          Try again
        </button>
      )}

      <p className="text-xs text-[#D6D1CB] text-center max-w-xs">
        Your check-in data was not sent to any server. Please try again.
      </p>
    </div>
  );
}
